import { SlideData } from "../types";

export const salonData11Labs: SlideData[] = [
  // 1: Hook — Veo video
  { type: "scene", bgVideo: "veo-clips/clip01_hook.mp4" },
  // 2: Doubt — programmatic iMessage with exact text
  {
    type: "imessage",
    contactName: "Scori",
    messages: [
      {
        text: "I've been trying to book with you for 2 weeks!!",
        isMe: false,
      },
      {
        text: "I literally cannot answer mid-color 😭",
        isMe: true,
      },
    ],
  },
  // 3: Problem — Veo video
  { type: "scene", bgVideo: "veo-clips/clip03_problem.mp4" },
  // 4: AI working — programmatic notifications (no AI text garbling)
  {
    type: "notifications",
    items: [
      "📅 Appointment booked: Balayage, Saturday 2pm",
      "👥 Waitlist updated · 3 clients added",
      "✅ No-show reminder sent to clients",
    ],
  },
  // 5: Convert — programmatic iMessage with exact text
  {
    type: "imessage",
    contactName: "Stylist",
    messages: [
      {
        text: "I went from 40% no-shows to 5% because AI confirms every appointment",
        isMe: true,
      },
      {
        text: "I'm literally crying 😭",
        isMe: true,
      },
      {
        text: "WAIT WHAT. I need this.",
        isMe: false,
      },
    ],
  },
  // 6: Payoff — smiling stylist Veo video
  { type: "scene", bgVideo: "veo-clips/clip05_convert.mp4" },
  // 7: Closer — CallWall logo + mascot + website
  {
    type: "closer",
    bgImage: "callwall-mascot.jpg",
    showLogo: true,
  },
];

export const salon11LabsAudio = [
  "voiceover/salon-v2/scene-01-hook.mp3",
  "voiceover/salon-v2/scene-02-combined.mp3",
  "voiceover/salon-v2/scene-03-problem.mp3",
  "voiceover/salon-v2/scene-04-ai.mp3",
  "voiceover/salon-v2/scene-05-convert.mp3",
  "voiceover/salon-v2/scene-06-closer.mp3",
  "", // scene-07 mascot — silent
];

export const salon11LabsCaptions = [
  "captions/salon-v2/scene-01-hook.json",
  "captions/salon-v2/scene-02-combined.json",
  "captions/salon-v2/scene-03-problem.json",
  "captions/salon-v2/scene-04-ai.json",
  "captions/salon-v2/scene-05-convert.json",
  "captions/salon-v2/scene-06-closer.json",
  "", // scene-07 mascot — no captions
];

export const salon11LabsDurations = [
  Math.ceil((5.67 + 0.3) * 30),  // scene-01 hook
  Math.ceil((4.60 + 0.3) * 30),  // scene-02 iMessage doubt
  Math.ceil((5.20 + 0.3) * 30),  // scene-03 problem
  Math.ceil((6.11 + 0.3) * 30),  // scene-04 notifications
  Math.ceil((7.24 + 0.3) * 30),  // scene-05 iMessage convert
  Math.ceil((3.06 + 0.3) * 30),  // scene-06 payoff clip05
  Math.ceil(2.5 * 30),           // scene-07 mascot closer
];
