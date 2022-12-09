const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { saveContact, findContact, addCont, cekDuplikat, deleteContact, updateContact } = require("./utils/contact");
const { body, validationResult, check } = require("express-validator");
const req = require("express/lib/request");
// const flash = require("connect-flash");

const app = express();
const port = 3000;

//memanggil ejs
app.set("view engine", "ejs");
//menampilkan gambar
app.use(express.static("public"));
//parsing data dari html ke json agar tidak undifined
app.use(
  express.urlencoded({
    extended: true,
  })
);
//memanggil express layouts
app.use(expressLayouts);

app.get("/", (req, res) => {
  res.render("index", { nama: "Anifa", layout: "layout/main", title: "Home Page" }); //menambahkan objek
});

app.get("/about", (req, res) => {
  res.render("about", { layout: "layout/main", title: "About Page" });
});

app.get("/contact", (req, res) => {
  const contacts = saveContact();
  res.render("contact", { layout: "layout/main", title: "Contact Page", contacts });
});

//form tambah data contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Add New Contact",
    layout: "layout/main",
  });
});
//function validator email dan mobile phone
app.post(
  "/contact",
  [
    body("name").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("Name Exist!");
      }
      return true;
    }),
    check("email", "Email Tidak Valid").isEmail(),
    check("mobile", "Mobile Tidak Valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("add-contact", {
        title: "Add Data Contact",
        layout: "layout/main",
        errors: errors.array(),
      });
    }
    addCont(req.body);
    res.redirect("/contact");
  }
);

//detail contact
app.get("/contact/:name", (req, res) => {
  const contact = findContact(req.params.name);
  res.render("detail", {
    layout: "layout/main",
    title: "Detail Contact",
    contact,
    name: req.params.name,
  });
});

//delete contact
app.get("/contact/delete/:name", (req, res) => {
  const contact = findContact(req.params.name);
  //jika contact tidak ada
  if (!contact) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteContact(req.params.name);
    // req.flash("msg", "Data Deleted!");
    res.redirect("/contact");
  }
});

//update data contact
app.get("/contact/edit/:name", (req, res) => {
  const contact = findContact(req.params.name);
  res.render("edit-contact", {
    title: "Edit Contact",
    layout: "layout/main",
    contact,
  });
});

//proses ubah data
app.post(
  "/contact/update",
  [
    body("name").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Name Exist!");
      }
      return true;
    }),
    check("email", "Email Tidak Valid").isEmail(),
    check("mobile", "Mobile Tidak Valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("edit-contact", {
        title: "Edit Data Contact",
        layout: "layout/main",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContact(req.body);
      res.redirect("/contact");
    }
  }
);

//untuk req apapun
app.use("/", (req, res) => {
  res.status(404);
  res.send("Page Not Found 404");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
