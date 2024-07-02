export type MessageProps = {
  subtype: string;
  ts: string;
  text: string;
  channel: string;
};

export type ChannelCreateProps = {
  type: string;
  channel: {
    id: string;
    name: string;
    created: number;
    creator: string;
  };
};

export type ConversationsInfoProps = {
  channel: {
    name: string;
  };
};
