import { SlideData } from "../types";

export const vcData11Labs: SlideData[] = [
  // 1: Hook — AI-generated stressed founder image
  { type: "scene", bgVideo: "veo-clips/vc-founder-hook.mp4" },
  // 2: iMessage — Jake (founder friend)
  {
    type: "imessage",
    contactName: "Jake",
    messages: [
      {
        text: "Dude I've called like 30 VCs this week. All voicemail.",
        isMe: false,
      },
      {
        text: "Same. Except one firm had AI pick up. It actually asked about my ARR and scheduled a partner call??",
        isMe: true,
      },
    ],
  },
  // 3: Problem — empty VC office
  { type: "scene", bgImage: "vc-empty-office.jpg" },
  // 4: Notifications — AI working
  {
    type: "notifications",
    items: [
      "📞 Founder call screened: Series A, $3M ARR",
      "📅 Partner meeting scheduled: Thursday 2pm",
      "📄 Deck forwarded to investment team",
    ],
  },
  // 5: iMessage — Founder payoff
  {
    type: "imessage",
    contactName: "Founder",
    messages: [
      {
        text: "That AI receptionist just followed up with me. Said the partner reviewed my deck and wants to meet Friday.",
        isMe: true,
      },
      {
        text: "No way. A VC that actually calls you BACK??",
        isMe: false,
      },
      {
        text: "I'm literally shaking 😭",
        isMe: true,
      },
    ],
    payoffImage: "vc-payoff-v2.jpg",
    payoffAtFrame: 165,
  },
  // 6: Payoff — confident founder
  { type: "scene", bgImage: "vc-payoff-v2.jpg" },
  // 7: Closer — CallWall mascot + logo
  {
    type: "closer",
    bgImage: "callwall-mascot.jpg",
    showLogo: true,
  },
];

export const vc11LabsAudio = [
  "voiceover/vc/scene-01-hook.mp3",
  "voiceover/vc/scene-02-imessage.mp3",
  "voiceover/vc/scene-03-problem.mp3",
  "voiceover/vc/scene-04-notifications.mp3",
  "voiceover/vc/scene-05-convert.mp3",
  "voiceover/vc/scene-06-payoff.mp3",
  "", // scene-07 closer — silent
];

export const vc11LabsCaptions = [
  "captions/vc/scene-01-hook.json",
  "captions/vc/scene-02-imessage.json",
  "captions/vc/scene-03-problem.json",
  "captions/vc/scene-04-notifications.json",
  "captions/vc/scene-05-convert.json",
  "captions/vc/scene-06-payoff.json",
  "", // scene-07 closer — no captions
];

export const vc11LabsDurations = [
  Math.ceil((3.34 + 0.3 + 1.0) * 30),  // scene-01 hook (+1s delay)
  Math.ceil((2.93 + 0.3) * 30),  // scene-02 iMessage
  Math.ceil((6.40 + 0.3) * 30),  // scene-03 problem
  Math.ceil((4.44 + 0.3) * 30),  // scene-04 notifications
  Math.ceil((6.22 + 0.3) * 30),  // scene-05 iMessage convert
  Math.ceil((2.04 + 0.3) * 30),  // scene-06 payoff
  Math.ceil(2.5 * 30),           // scene-07 closer
];
