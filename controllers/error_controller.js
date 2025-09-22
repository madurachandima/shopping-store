const pageNotFound = (req, res, next) => {
  res.status(404).render("page-not-found", {
    pageTitle: "Page Not Found",
    path: "/404",
  });
};

const somethingWring = (req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Something Went Wrong",
    path: "/500",
  });
};

export { pageNotFound, somethingWring };
