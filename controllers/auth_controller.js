import { User } from "../models/user.js";

const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    editing: false,
    isAuthenticated: req.isLoggedIn,
  });
};

const postLogin = (req, res, next) => {
  User.findById("6854e55be6464edb37a50cff")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          console.log(err);
        }
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    editing: false,
    isAuthenticated: req.isLoggedIn,
  });
};

const postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  console.log("call signup email ", email, "password ", password, "con pw" , confirmPassword);

  if (!email || !password) {
    return res.redirect("/auth/signup");
  }

  if (password !== confirmPassword) {
    // req.flash("error", "Passwords do not match");
    return res.redirect("/auth/signup");
  }
  
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        // req.flash("error", "Email already exists");
        console.log("Email already exists");
        return res.redirect("/auth/signup");
      }
      const user = new User({
        email: email,
        password: password,
        cart: { items: [] },
      });
      console.log("new user creste --------->>>>>>>>>>>>>>>.. ");
      return user.save();
    })
    .then(() => {
      res.redirect("/auth/login");
    })
    .catch((err) => {
      console.log(err);
    });

  // User.findById("6854e55be6464edb37a50cff")
  //   .then((user) => {
  //     // req.session.isLoggedIn = true;
  //     // req.session.user = user;
  //     // req.session.save((err) => {
  //     //   if (err) {
  //     //     console.log(err);
  //     //   }
  //     //   res.redirect("/");
  //     // });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
export { getLogin, postLogin, postLogout, getSignup, postSignup };
