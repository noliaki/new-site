# for NEW SITE

## 推奨環境

```sh
$ node -v
v5.3.0

$ npm -v
3.3.12
```

## 構築手順

```sh
$ npm install -g gulp
$ git clone git@github.com:noliaki/new-site.git
$ cd new-site
$ npm install
$ gulp
```


## HTML

jade or haml

* 記述量の削減
* レイアウト・テンプレート機能
* 閉じタグミスを排除
* コードの平坦化

## CSS

SASS

* 記述量の削減

### ルール

#### インデントは2スペース

* コードの平坦化

```css
/* NG */
.hoge {
    margin-top: 0px;
}

/* OK */
.hoge {
  margin-top: 0;
}
```

#### IDの使用禁止

* ID要素は再利用可能でない
* 上書きが容易にできない
* 複数人で作業する場合、重複する可能性がある

#### 値が0の時、単位を記述しない

* JavaScriptとCSS、それぞれの修正が極力相手に影響しないよう、疎結合を保つため。

```css
/* NG */
.hoge {
  margin-top: 0px;
}

/* OK */
.hoge {
  margin-top: 0;
}
```

#### jsプレフィックス付与

* JavaScriptとCSS、それぞれの修正が極力相手に影響しないよう、疎結合を保つため。

```css
/* NG */
.js-hoge {
  margin-top: 10px;
}

/* OK */
.hoge {
  margin-top: 10px;
}
```

#### ネストは2つまで

* 汎用性を重視

```css
/* NG */
.fuga .hoge .fugahoge {
  margin-top: 10px;
}

/* OK */
.fugahoge {
  margin-top: 10px;
}

.hoge .fugahoge {
  margin-top: 10px;
}
```

#### タイプセレクタを記述しない

* 汎用性を重視

```css
/* NG */
ul.hoge {
  margin-top: 10px;
}

ul .list {
  margin-top: 10px;
}

/* OK */
.hoge {
  margin-top: 10px;
}

.nav .list {
  margin-top: 10px;
}
```

#### 別々のセレクタとプロパティは改行して書く

* 可読性を重視

```css
/* NG */
.fuga, .hoge {
  margin-top: 30px;
}

/* OK */
.fuga,
.hoge {
  margin-top: 30px;
}
```

#### ユニバーサルセレクタは使用しない

* 可読性を重視

```css
/* NG */
* {
  margin-top: 30px;
}

/* OK */
.fuga,
.hoge {
  margin-top: 30px;
}
```