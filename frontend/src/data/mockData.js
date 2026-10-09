export const demoNarratives = [
  {
    key: "online-harassment",
    title: "Online harassment",
    category: "Cyber harassment",
    narrative:
      "For about two weeks, someone has been messaging me on Instagram and threatening to share private photos. After I blocked the first account, another account contacted me. I have saved screenshots.",
  },
  {
    key: "payment-scam",
    title: "Payment scam",
    category: "Financial fraud",
    narrative:
      "Yesterday afternoon I received a text about an electricity bill and followed a payment link. After I entered my UPI PIN, money was taken from my bank account. I have the bank message but need to find the transaction reference.",
  },
  {
    key: "workplace-pressure",
    title: "Workplace incident",
    category: "Workplace safety",
    narrative:
      "My supervisor has repeatedly contacted me late at night on WhatsApp for personal conversations. When I asked to keep messages work-related, they said it could affect my performance review.",
  },
  {
    key: "physical-threat",
    title: "Physical threat",
    category: "Police report",
    narrative:
      "A neighbour has been following me near my lane for the last three evenings and threatened to harm me if I complained. I noted the time and place and my friend saw one incident.",
  },
  {
    key: "consumer-cyber-scam",
    title: "Fake shopping scam",
    category: "Cyber fraud",
    narrative:
      "I ordered a phone from a social media seller after paying an advance through UPI. The seller stopped responding, deleted the product post, and the courier tracking number appears fake.",
  },
];

export const demoEvidence = {
  "online-harassment": [
    { type: "screenshot", description: "Saved screenshots of the Instagram messages and second account.", source: "Phone gallery" },
  ],
  "payment-scam": [
    { type: "message", description: "Bank debit message and suspicious electricity bill text.", source: "SMS inbox" },
  ],
  "workplace-pressure": [
    { type: "message", description: "WhatsApp screenshots showing late-night messages.", source: "WhatsApp" },
  ],
  "physical-threat": [
    { type: "other", description: "Friend witnessed the threat near the lane in the evening.", source: "Witness note" },
  ],
  "consumer-cyber-scam": [
    { type: "transaction_reference", description: "UPI payment reference and seller chat screenshots.", source: "UPI app and social media chat" },
  ],
};
