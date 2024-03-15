import axios from "axios";

const runWebhook = async (type) => {
  if (type === 'finish' && process.env.WEBHOOK_FINISH) {
    const webhookUrls = process.env.WEBHOOK_FINISH.split(',');

    for (const url of webhookUrls) {
      try {
        await axios.post(url, {
          'clear_cache': true
        });
      } catch (error) {}
    }
  }
}

export default runWebhook