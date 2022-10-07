---
slug: 2019/type-compatibility-in-typescript
title: TypeScriptにおける型の互換性（翻訳）
published: 2019-05-25T00:00:00.000Z
lastUpdated: 2021-06-22T00:00:00.000Z
author: Masafumi Koba
tags: typescript
---

# TypeScriptにおける型の互換性（翻訳）

TypeScriptドキュメント『[_Type Compatibility_](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)』を読んで面白い内容だったので、勉強がてら翻訳してみました。
なお、この翻訳に関する一切の責任は負いかねますので、あらかじめご了承ください。

## 導入

TypeScriptにおける型の互換性は、構造上の派生型付け（structural subtyping [^1]）にもとづきます。構造上の型付け（structural typing）とは、型のメンバーだけにもとづいて型を関連づける方法です。これは名目上の型付け（nominal typing）とは対照的です。以下のコードを考えてみましょう。

```typescript
interface Named {
    name: string;
}

class Person {
    name: string;
}

let p: Named;
// OK, because of structural typing
p = new Person();
```

C#やJavaのような名目上の型付けをもつ言語においては、同等のコードはエラーとなるでしょう。なぜなら`Person`クラスは、自身を`Named`インターフェースの実装として明示的に記述してないからです。

TypeScriptの構造上の型システム（structural type system）は、JavaScriptコードが一般的にどのように書かれているか、にもとづいて設計されました。JavaScriptは関数式やオブジェクトリテラルといった無名オブジェクト（anonymous object）を広く使うので、JavaScriptライブラリに見られる様々な種類の関係性を名目上ではなく構造上の型システムによって表わす方が、ずっと自然です。

### 安全性についての注釈

TypeScript型システムは、コンパイル時に安全であると知ることができない操作を許しています。ある型システムがこの特性をもつとき、それは「安全（sound）」でないと言われます。TypeScriptが安全でない振る舞いを許している場所は慎重に検討されており、このドキュメント全体を通じて、私たちはこれらの振る舞いが起こる場所とその背後にある動機づけのシナリオについて説明するつもりです。

## 始めよう

TypeScriptの構造上の型システムの基本ルールは、もし`y`が少なくとも`x`と同じメンバーをもつのであれば`x`は`y`と互換性がある、というものです。例を挙げます。

```typescript
interface Named {
    name: string;
}

let x: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: "Alice", location: "Seattle" };
x = y;
```

`y`が`x`に代入できるかどうかをチェックするために、コンパイラーは`y`の中に該当する互換プロパティを見つけようと`x`の各プロパティをチェックします。この場合、`y`は`name`という名前の文字列メンバーをもつ必要があります。`y`がそういったメンバーをもっていれば、代入は許されます。

代入に対する同じルールが、関数呼び出しの引数をチェックするときに使われます。

```typescript
function greet(n: Named) {
    console.log("Hello, " + n.name);
}
greet(y); // OK
```

`y`が余分な`location`プロパティをもっていることに注意してください。しかし、これはエラーを起こしません。比較先の型（このケースでは`Named`）のメンバーだけが、互換性のチェック時に考慮されるのです。

この比較プロセスは再帰的に実行され、各メンバーとサブメンバーの型を探索します。

## ２つの関数を比較する

プリミティブ型とオブジェクト型を比較することは比較的簡単ですが、どんな種類の関数に互換性があると考えるべきかという問題は、もう少し複雑です。引数リストのみが異なる２つの関数の簡単な例から始めてみましょう。

```typescript
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

`x`が`y`に代入できるかどうかをチェックするために、私たちはまず引数リストを見ます。`x`の中の各引数は、互換性のある型をもった対応する引数を`y`の中にもつ必要があります。引数の名前は考慮されず、型のみが考慮されることに注意してください。この例では、`x`のすべての引数は`y`の中に対応する互換性のある引数をもっていますので、代入は許されます。

２番目の代入はエラーです。なぜなら、`y`は`x`がもたない必須の第２引数をもつからです。したがって、代入は許されません。

なぜ私たちが`y = x`の例にあるような「捨てる（discarding）」引数を許しているのか、疑問に思うかもしれません。この代入が許される理由は、余分な関数引数を無視することがJavaScriptでは実際にかなりよくあるからです。例えば、 `Array#forEach` [^2] はコールバック関数に３つの引数を提供します。配列の要素、その要素のインデックス、そして配列そのものです。にもかかわらず、第１引数のみを使うコールバックを提供するのはとても便利です。

```typescript
let items = [1, 2, 3];

// Don't force these extra parameters
items.forEach((item, index, array) => console.log(item));

// Should be OK!
items.forEach(item => console.log(item));
```

戻り値の型のみが異なる２つの関数を使って、戻り値の型がどのように扱われるか見てみましょう。

```typescript
let x = () => ({name: "Alice"});
let y = () => ({name: "Alice", location: "Seattle"});

x = y; // OK
y = x; // Error, because x() lacks a location property
```

型システムは、比較元の関数の戻り値型が比較先の型（関数）の戻り値型の部分型であることを強制します。

### 関数引数の２つの不一致

関数引数の型を比較するとき、比較元の引数が比較先の引数に代入可能であるかまたはその逆の場合、代入は成功します。これは安全ではありません（unsound）。なぜなら呼び出し元は、より特殊な型を受け取るがより特殊でない型でその関数を呼び出す関数を与えられることになるかもしれないからです。実際にはこの種のエラーはまれで、これにより多くのよくあるJavaScriptパターンが可能になります。次は、簡単な例です。

```typescript
enum EventType { Mouse, Keyboard }

interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }
interface KeyEvent extends Event { keyCode: number }

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
    /* ... */
}

// Unsound, but useful and common
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + "," + e.y));

// Undesirable alternatives in presence of soundness
listenEvent(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x + "," + (<MouseEvent>e).y));
listenEvent(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x + "," + e.y)));

// Still disallowed (clear error). Type safety enforced for wholly incompatible types
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

### 任意引数と可変長引数

関数の互換性を比較するとき、任意引数と必須引数は交換可能です。比較元の型の余分な任意引数はエラーとならず、比較元の型にある対応する引数をもたない比較先の任意引数はエラーになりません。

ある関数が可変長引数（Rest parameters [^3]）をもつとき、その引数はあたかも一連の無限個の任意引数であるかのように扱われます。

これは型システムの観点からは安全ではないのですが、実行時の観点からは、任意引数のアイデアは一般的にあまりうまく強制できないのです。なぜなら、その引数の位置に`undefined`を渡すことはほとんどの関数にとって同等だからです。

以下の動機づけの例は、コールバックを受けとって、（プログラマーにとって）予測可能だが（型システムにとって）未知の数の引数でそのコールバックを呼び出す関数のよくあるパターンです。

```typescript
function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* ... Invoke callback with 'args' ... */
}

// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ", " + y));

// Confusing (x and y are actually required) and undiscoverable
invokeLater([1, 2], (x?, y?) => console.log(x + ", " + y));
```

### オーバーロードをもつ関数

ある関数がオーバーロードをもつとき、比較元の型にある各オーバーロードは比較先の型の互換性のあるシグネチャによってマッチされなければなりません。このことは、比較先の関数は比較元の関数と同じすべての状況で呼ばれることができる、ということを保証します。

## 列挙

列挙 [^4] は数値と互換性があり、数値は列挙と互換性があります。異なる列挙型同士の列挙値は、非互換だと判断されます。以下は例です。

```typescript
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

let status = Status.Ready;
status = Color.Green;  // Error
```

## クラス

クラスは、１つの例外を除いて、オブジェクトリテラル型やインターフェースと同じように働きます。クラスは静的な型とインスタンス型の両方をもちます。クラス型の２つのオブジェクトを比較するとき、そのインスタンスのメンバーのみが比較されます。静的メンバー（static member）とコンストラクターは互換性に影響しません。

```typescript
class Animal {
    feet: number;
    constructor(name: string, numFeet: number) { }
}

class Size {
    feet: number;
    constructor(numFeet: number) { }
}

let a: Animal;
let s: Size;

a = s;  // OK
s = a;  // OK
```

### クラス内のprivateおよびprotectedメンバー

クラス内のprivateおよびprotectedメンバーは互換性に影響します。あるクラスのインスタンスが互換性をチェックされるとき、比較先の型がprivateメンバーを含むならば、比較元の型もまた同じクラス由来のprivateメンバーを含む必要があります。同様に、同じことはprotectedメンバーをもつインスタンスにもあてはまります。これにより、クラスはそのスーパークラスと代入互換になりますが、異なる継承階層のクラスとは、たとえおなじ形をしていても、互換性はありません。

## ジェネリクス

TypeScriptは構造上の型システムなので、型引数は、あるメンバーの型の一部として消費されるときの結果の型にのみ影響します。例を挙げます。

```typescript
interface Empty<T> {
}
let x: Empty<number>;
let y: Empty<string>;

x = y;  // OK, because y matches structure of x
```

上の例では、`x`と`y`は互換性があります。なぜなら、それらの構造は区別されるやり方で型引数を使わないからです。`Empty<T>`にメンバーを追加することによってこの例を変更すると、これがどのように働いているかを示せます。

```typescript
interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // Error, because x and y are not compatible
```

このように、型引数を指定したジェネリクス型 [^5] は非ジェネリクス型と同じように振る舞います。

指定された型引数をもたないジェネリクス型にとっては、未指定の型引数のすべての場所に`any`を指定することによって互換性はチェックされます。このとき結果となる型が互換性をチェックされます。ちょうど非ジェネリクス型のときのように。

以下は、例です。

```typescript
let identity = function<T>(x: T): T {
    // ...
}

let reverse = function<U>(y: U): U {
    // ...
}

identity = reverse;  // OK, because (x: any) => any matches (y: any) => any
```

## 高度なトピック

### 派生型 vs 代入

これまで、私たちは「互換性がある（compatible）」という言葉を使ってきました。これは言語仕様で定義された用語ではありません。TypeScriptには、２種類の互換性があります。部分型と代入です。これらは代入が、`any`からおよび`any`への代入、対応する数値から`enum`へおよび`enum`から数値への代入を許すというルールによって、部分型の互換性を拡張している、という点でのみ異なります。

この言語内の様々な場所が、２つの互換性メカニズムのうちの１つを、状況に応じて使っています。実際上の目的のため、型互換性は代入互換性によって定められており、`implements`および`extends`節の場合でもそれは同様です。

詳細については、[TypeScript仕様](https://github.com/microsoft/TypeScript/blob/711b4e778b168117f7034a28ec821df22aa617cf/doc/spec-ARCHIVED.md)をご覧ください。

## 変更履歴

- April 24, 2021: 脚注を見出し（`<h*>`）から変更。
- June 22, 2021: 「TypeScript仕様」リンクの404エラーを修正。脚注を改善。

[^1]: 「Structural Subtyping」はふつう「構造的部分型」と訳されますが、「部分型」という日本語がイマイチしっくりこなかったので、「派生」を強調した訳にしました。
[^2]: [Array.prototype.forEach() - MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
[^3]: 「可変長引数」はふつう「variable arguments」の訳ですが、JavaScriptでは「rest parameters」に対応する訳がなかったので「可変長引数」と訳しました。参考：[Rest parameters - MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/rest_parameters)
[^4]: String Enumは[TypeScript 2.4から導入](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-4.html)されました。参考：[Enums · TypeScript](https://www.typescriptlang.org/docs/handbook/enums.html)
[^5]: [Generics · TypeScript](https://www.typescriptlang.org/docs/handbook/generics.html)
