exports.index = (req, res) => {
    res.render("index", { title: "Home" })
};

exports.login = (req, res) => {
    res.render('./user/login', { title: "Login" });
}

exports.signup = (req, res) => {
    res.render('./user/signup', { title: "Signup" });
}

exports.contact = (req, res) => {
    res.render('contact', { title: "Contact" });
}