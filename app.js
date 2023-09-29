const express = require('express');
const mysql = require("mysql");
const app = express();


// CSSや画像ファイルを置くフォルダを指定するコード
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// 定数connectionを定義して接続情報の書かれたコードを代入
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'makoto0808',
  database: 'list_app'
});

// トップ画面を表示するルーティングを作成           
app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get("/index", (req, res) => {
  // データベースからデータを取得する処理
  connection.query(
    // SELECTですべてのメモを取得
    "SELECT * FROM items",
    // error：クエリが失敗したときのエラー情報
    // results：クエリの実行結果 
    (error, results) => {
      // res.renderの第２引数にオブジェクトを追加
      res.render('index.ejs', { items: results });
    }
  );
});

// 作成画面を表示するルーティング
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

// メモを追加するルーティング
app.post("/create", (req, res) => {

  connection.query(
    "INSERT INTO items (name) VALUES(?)",
    [req.body.itemName],
    (error, results) => {
      res.redirect("/index");
    }
  );
});

// メモを削除するルーティング
app.post("/delete/:id", (req, res) => {
  // ルートパラメータで受け取った値を出力
  connection.query(
    "DELETE FROM items WHERE id = ?",
    [req.params.id],
    (error, results) => {
      res.redirect("/index;")
    }
  )
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

app.post('/update/:id', (req, res) => {
  // 選択されたメモを更新する処理を書いてください
  connection.query(
    "UPDATE items SET name = ? where id = ?",
    [req.body.itemName, req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
    )
  });

app.listen(5000);