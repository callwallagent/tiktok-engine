export interface Message {
  text: string;
  isMe: boolean;
}

export interface SlideData {
  type: "hook" | "imessage" | "scene" | "notifications" | "closer";
  topText?: string;
  bottomText?: string;
  bgImage?: string;
  bgVideo?: string;
  contactName?: string;
  messages?: Message[];
  items?: string[];
  showLogo?: boolean;
  payoffImage?: string;
  payoffVideo?: string;
  payoffAtFrame?: number;
}
