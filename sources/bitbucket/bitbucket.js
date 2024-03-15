import axios from 'axios';
import { FormData, File } from 'formdata-node';
import { FormDataEncoder } from 'form-data-encoder';

const pushMultipleFiles = async (directory, items, fileNameProperty) => {
    const apiUrl = `https://api.bitbucket.org/2.0/repositories/${process.env.BITBUCKET_WORKSPACE}/${process.env.BITBUCKET_REPO_SLUG}/src`;
    const authHeaders = {
        Authorization: `Basic ${Buffer.from(`${process.env.BITBUCKET_USERNAME}:${process.env.BITBUCKET_PASSWORD}`).toString('base64')}`,
    };

    const commitMessage = 'Content Sync';
    const branchName = 'master';

    const processChunk = async (chunk) => {
        const formData = new FormData();
        chunk.forEach(data => {
            const fileName = data[fileNameProperty] || 'homepage';
            const filePath = `${directory}/${fileName}.md`;
            const fileContent = JSON.stringify(data, null, 2);
            const file = new File([fileContent], filePath);
            formData.set(filePath, file);
        });

        formData.set('message', commitMessage);
        formData.set('branch', branchName);

        const encoder = new FormDataEncoder(formData);
        await axios.post(apiUrl, formData, { headers: { ...authHeaders, ...encoder.headers } });
    };

    for (let i = 0; i < items.length; i += 30) {
        const chunk = items.slice(i, i + 30);
        await processChunk(chunk);
    }
};

const deleteOldFiles = async (directory, items, fileNameProperty) => {
    const authHeaders = {
        Authorization: `Basic ${Buffer.from(`${process.env.BITBUCKET_USERNAME}:${process.env.BITBUCKET_PASSWORD}`).toString('base64')}`,
    };

    const commitsResponse = await axios.get(`https://api.bitbucket.org/2.0/repositories/${process.env.BITBUCKET_WORKSPACE}/${process.env.BITBUCKET_REPO_SLUG}/commits`, { headers: authHeaders });
    const commits = commitsResponse.data.values;

    if (!commits.length) {
        return
    }

    let nextUrl = `https://api.bitbucket.org/2.0/repositories/${process.env.BITBUCKET_WORKSPACE}/${process.env.BITBUCKET_REPO_SLUG}/src/${commits[0].hash}/${directory}`;
    let repoFiles = [];

    while (nextUrl) {
        const repoFilesRes = await axios.get(nextUrl, { headers: authHeaders });

        repoFiles = [...repoFiles, ...repoFilesRes.data.values];

        nextUrl = repoFilesRes.data.next || null;
    }

    const itemFilePaths = items.map(item => {
        const fileName = item[fileNameProperty] || 'homepage'

        return `${directory}/${fileName}.md`
    });
    const filesToDelete = repoFiles.filter(file => !itemFilePaths.includes(file.path));

    if (filesToDelete.length > 0) {
        const deleteFormData = new FormData();
        const deleteEncoder = new FormDataEncoder(deleteFormData)

        filesToDelete.forEach(file => {
            deleteFormData.append('files', file.path);
        });

        deleteFormData.set('message', `Deleting ${filesToDelete.length} file(s)`);
        deleteFormData.set('branch', 'master');

        await axios.post(`https://api.bitbucket.org/2.0/repositories/${process.env.BITBUCKET_WORKSPACE}/${process.env.BITBUCKET_REPO_SLUG}/src`, deleteFormData, { headers: { ...authHeaders, ...deleteEncoder.headers } });
    }
}

export {
    pushMultipleFiles,
    deleteOldFiles
}