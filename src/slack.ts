import { App } from "@slack/bolt";
import dotenv from "dotenv";
dotenv.config();

import { MessageProps, ChannelCreateProps } from "./types";

const channelId = process.env.CHANNEL_ID as string;
const app = new App({
  token: process.env.SLACK_BOT_TOKEN as string,
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
});

// レスポンス１：Slackチャンネルが#八戸_opt発注依頼_相談で『受注確定』または『新規受注』というワードが発生した際に#受注確定クライアント検知_capi提案へ通知を知らせる
app.event("message", async ({ event, client, logger }) => {
  const { subtype, ts, text, channel } = event as MessageProps;

  if (subtype) {
    throw new Error("BOTからのメッセージです。");
  }
  if (text.indexOf("受注確定") < 0 && text.indexOf("新規受注") < 0) {
    throw new Error(
      "『受注確定』または『新規受注』のワードが含まれていません。"
    );
  }

  try {
    // メッセージのパーマリンクを取得
    const { permalink } = await client.chat.getPermalink({
      channel: channel,
      message_ts: ts,
    });

    // リンク付きメッセージを送信
    await client.chat.postMessage({
      channel: channelId,
      text: `<#${channel}> で『受注確定』または『新規受注』のワードが検知されました。\n${permalink}`,
    });
  } catch (error) {
    logger.error(error);
  }
});

// レスポンス２：オプトのSlack上に『新規_』というチャンネルが新規作成された際に#受注確定クライアント検知_capi提案へ通知を知らせる
app.event("channel_created", async ({ event, client, logger }) => {
  const { channel } = event as ChannelCreateProps;

  if (channel.name.indexOf("新規_") < 0) {
    throw new Error("チャンネル名に『新規_』のワードが含まれていません。");
  }

  try {
    // リンク付きメッセージを送信
    const result = await client.chat.postMessage({
      channel: channelId,
      text: `<#${channel.id}> が新規作成されました。`,
    });

    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log(`⚡️ Bolt app is running!`);
})();
