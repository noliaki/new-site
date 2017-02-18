# template NEW SITE

[![Greenkeeper badge](https://badges.greenkeeper.io/noliaki/new-site.svg)](https://greenkeeper.io/)

[![node](https://img.shields.io/badge/node-v6.5.x-yellow.svg)](https://github.com/noliaki/new-site/blob/master/README.md)
[![npm](https://img.shields.io/badge/npm-3.10.3-blue.svg)](https://github.com/noliaki/new-site/blob/master/README.md)
[![Build Status](https://travis-ci.org/noliaki/new-site.svg?branch=master)](https://travis-ci.org/noliaki/new-site)
[![devDependency Status](https://david-dm.org/noliaki/new-site/master/dev-status.svg)](https://david-dm.org/noliaki/new-site/master#info=devDependencies)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/noliaki/new-site/blob/master/README.md)

## USAGE

```sh
$ git clone git@github.com:noliaki/new-site.git
$ cd new-site
$ npm install
$ npm run build
```

## DEPLOY COMMAND

```sh
# for staging
# default branch is `master`
$ gulp deploy:staging --branch=hogebranch

# for production
# `version` environment variable is required
$ gulp deploy:production --version=v1.0.0
```

## HTML

using `Pug`

## CSS

using `SASS`

### RULES

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

#### IDへのスタイル禁止

* 再利用可能でない
* 上書きが容易にできない
* 複数人で作業する場合、重複する可能性がある

もしどうしても必要な場合は、詳細度をクラスと同等にするため属性セレクタとして装飾する

```css
/* NG */
#hoge {
  margin-top: 0;
}

/* not NG */
[id="hoge"] {
  margin-top: 0;
}
```


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

#### ネストは2つまで（要検討）

* 汎用性を重視
* パフォーマンス重視（cssのセレクタは右から読まれる）

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
* 意図しない要素へ影響させない

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

#### z-indexはsassで管理

* むやみやたらに9999とかにしないように

```sass
$z-index: hoge, fuga, piyo;

.hoge {
  z-index: index($z-index, hoge);/* => z-index: 1; */
}
```

#### コメント

```sass
// =============================================
//  大見出し
// =============================================

// --------------------------------------
//  中見出し
// --------------------------------------

// ...............................
//  小見出し
// ...............................

```
