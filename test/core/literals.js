module("Core - Literals");

test("Literal API", function () {
    var v = new VIE();
    ok(v.Literal);
    
    var literal = new v.Literal();
    equal(typeof literal.toString, "function");
    equal(typeof literal.toTurtle, "function");
    equal(typeof literal.isLiteral, "boolean");
    ok(literal instanceof Backbone.Model);
});

test("Boolean Literal API", function () {
    var v = new VIE();

    ok(v.BooleanLiteral);
    var booleanliteral = new v.BooleanLiteral();
    ok(booleanliteral.isLiteral);
    ok(booleanliteral instanceof Backbone.Model);
    equal(typeof booleanliteral.toString, "function");
    equal(typeof booleanliteral.toTurtle, "function");
    var trueLit = new v.BooleanLiteral(true);
    var falseLit = new v.BooleanLiteral(false);
    var falseNosetLit = new v.BooleanLiteral();

    ok(trueLit);
    ok(falseLit);
    ok(falseNosetLit);
    var tr = trueLit.get();
    var fa = falseLit.get();
    var fa2 = falseNosetLit.get();

    equal(tr, true);
    equal(fa, false);
    equal(fa2, false);

    equal(trueLit.toString(), "true");
    equal(trueLit.toTurtle(), "true");
    equal(falseLit.toString(), "false");
    equal(falseLit.toTurtle(), "false");
    equal(falseNosetLit.toString(), "false");
    equal(falseNosetLit.toTurtle(), "false");
});


test("NumberLiteral API", function () {
    var v = new VIE();

    ok(v.NumberLiteral);
    var numberliteral = new v.NumberLiteral();
    ok(numberliteral.isLiteral);
    ok(numberliteral instanceof Backbone.Model);
    equal(typeof numberliteral.toString, "function");
    equal(typeof numberliteral.toTurtle, "function");
    var intLit = new v.NumberLiteral(3);
    var doubLit = new v.NumberLiteral(17.12);
    var negIntLit = new v.NumberLiteral(-15);

    ok(intLit);
    ok(doubLit);
    ok(negIntLit);
    var inte = intLit.get();
    var doub = doubLit.get();
    var negInt = negIntLit.get();

    equal (typeof inte, "number");
    equal (typeof doub, "number");
    equal (typeof negInt, "number");
    
    equal(inte, 3);
    equal(doub, 17.12);
    equal(negInt, -15);

    equal(intLit.toString(), "3");
    equal(intLit.toTurtle(), "3");
    equal(doubLit.toString(), "17.12");
    equal(doubLit.toTurtle(), "17.12");
    equal(negIntLit.toString(), "-15");
    equal(negIntLit.toTurtle(), "-15");
});

/*

test("LiteralCollection API", function () {
    var v = new VIE();
    
    ok(v.LiteralCollection);
    equal(typeof v.LiteralCollection.toString, "function");
});

test("Typed Literals", function () {
    var v = new VIE();
    
    var intLit = new v.IntegerLiteral(3);
    ok(intLit);
    equ(intLit.toString)
    
    ok(v.Literal);
    ok(v.IntegerLiteral);
    ok(v.DoubleLiteral);
    ok(v.DatatypeLiteral);
    ok(v.StringLiteral);
    
    ok(v.LiteralCollection);    
});
 */
