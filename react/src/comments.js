import i18n from "i18next";

i18n.on("languageChanged", function (lng) {
  console.log(i18n.t("navbar.home"));
});

const comments = [
  {
    id: 1,
    text: i18n.t("navbar.home"),
    name: "Olivia sH.",
    avatar: "avatar1",
    rating: 5,
  },
  {
    id: 2,
    text: "Great selection and fast shipping. Recommend everyone!",
    name: "Emily M.",
    avatar: "avatar2",
    rating: 5,
  },
  {
    id: 3,
    text: "Highly recommend this store. Great prices and quality.",
    name: "Ethan T.",
    avatar: "avatar3",
    rating: 5,
  },
  {
    id: 4,
    text: "My new favorite place to buy shoes. So many options!",
    name: "Ryan P.",
    avatar: "avatar4",
    rating: 5,
  },
  {
    id: 5,
    text: "Easy ordering and quick delivery. Very satisfied!",
    name: "William E.",
    avatar: "avatar5",
    rating: 5,
  },
  {
    id: 6,
    text: "The shoes I bought are amazing. Great quality and fit perfectly.",
    name: "Jackson L.",
    avatar: "avatar6",
    rating: 5,
  },
  {
    id: 7,
    text: "The customer service at this store is excellent. So helpful!",
    name: "Benjamin H.",
    avatar: "avatar7",
    rating: 5,
  },
  {
    id: 8,
    text: "These sneakers are perfect for running. Highly recommend!",
    name: "Oliver S.",
    avatar: "avatar8",
    rating: 5,
  },
  {
    id: 9,
    text: "Fast and easy transaction. Will definitely be back.",
    name: "Charlotte M.",
    avatar: "avatar9",
    rating: 5,
  },
];

const updateCommentText = () => {
  comments.forEach((comment) => {
    switch (comment.id) {
      case 1:
        comment.text = i18n.t("navbar.home");
        break;
      case 2:
        comment.text = i18n.t("navbar.home");
        break;
      // Dodaj odpowiednie przypadki dla innych komentarzy
    }
  });
};

i18n.on("languageChanged", updateCommentText);

export default comments;
