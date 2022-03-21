exports.index = (req, res) => {
    res.render("index", { title: "Home" })
};

exports.about = (req, res) => {
    res.render("about", { title: "About" })
};

// exports.login = (req, res) => {
//     res.render('./user/login', { title: "Login" });
// }

// exports.signup = (req, res) => {
//     res.render('./user/signup', { title: "Signup" });
// }

exports.contact = (req, res) => {
    res.render('contact', { title: "Contact" });
}