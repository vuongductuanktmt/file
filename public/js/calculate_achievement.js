//how to run: node utils/code/calculate_achievement.js

function calculate_achievement(operator, target, real, max_score) {

    var max_score = typeof max_score !== 'undefined' ? max_score : 120;
    var score = 0;

    if (target == 0 && real == 0) {
        score = 100;
        return score;
    }


    if (real === null || target === null) {
        return null;
    }
    if (operator == '>=') {
        if (target == 0) {
            // target == real => target, real == 0 => score = 100
            if (target == real) {
                score = 100
            } else if (real < 0) {
                score = 0.001;
            } else {
                score = max_score;
            }
        }
        else if (target > 0) {

            score = real / target * 100  // 2.0 / 3 * 100
        }
        else if (target < 0) {

            score = 100 + ((target - real) / target) * 100;
        }
    }

    else if (operator == '<=') {
        if (target == 0) {
            if (real == 0) {
                score = 100
            } else if (real < 0) {
                score = max_score  // 100
            } else {
                score = 0.001;
            }
        }
        else if (target > 0) {
            score = 100 + (target - real) / target * 100;
        }
        else if (target < 0) {

            score = 100 - ((target - real) / target) * 100;

        }
    } else {
        //  print 'here'

        if (real == target) {
            score = 100  // 2.0 / 3 * 100
        }
        else {
            score = 0.001;
        }
    }
    if (score < 0) {
        score = 0;
    }
    if (score > max_score) {
        score = max_score;
    }
    return score;


}

function test_calculate_achivement() {



    //test >=
    console.log("***********: test >=");


    console.log(calculate_achivement(">=", 0, 0) == 100);
    console.log(calculate_achivement(">=", 0, 1) == 120);
    console.log(calculate_achivement(">=", 0, -1) == 0.001);


    console.log(calculate_achivement(">=", 10, 10) == 100);
    console.log(calculate_achivement(">=", 10, 8) == 80);
    console.log(calculate_achivement(">=", 10, 12) == 120);
    console.log(calculate_achivement(">=", 10, 13) == 120);

    console.log(calculate_achivement(">=", -10, 10) == 120);
    console.log(calculate_achivement(">=", -10, 8) == 120);
    console.log(calculate_achivement(">=", -10, 12) == 120);
    console.log(calculate_achivement(">=", -10, 13) == 120);
    console.log(calculate_achivement(">=", -10, -13) == 70);
    console.log(calculate_achivement(">=", -10, -8) == 120);
    console.log(calculate_achivement(">=", -10, -20) == 0);


    console.log("***********: test <=");


    console.log(calculate_achivement("<=", 0, 0) == 100);
    console.log(calculate_achivement("<=", 0, 1) == 0.001);
    console.log(calculate_achivement("<=", 0, -1) == 120);


    console.log(calculate_achivement("<=", 10, 10) == 100);
    console.log(calculate_achivement("<=", 10, 8) == 120);
    console.log(calculate_achivement("<=", 10, 12) == 80);
    console.log(calculate_achivement("<=", 10, 13) == 70);

    console.log(calculate_achivement("<=", -10, 10) == 0);
    console.log(calculate_achivement("<=", -10, 8) == 0);
    console.log(calculate_achivement("<=", -10, 12) == 0);
    console.log(calculate_achivement("<=", -10, 13) == 0);
    console.log(calculate_achivement("<=", -10, -13) == 120);
    console.log(calculate_achivement("<=", -10, -8) == 80);
    console.log(calculate_achivement("<=", -10, -20) == 120);


    console.log("***********: test =");


    console.log(calculate_achivement("=", 0, 0) == 100);
    console.log(calculate_achivement("=", 0, 1) == 0.001);
    console.log(calculate_achivement("=", 0, -1) == .001);


    console.log(calculate_achivement("=", 10, 10) == 100);
    console.log(calculate_achivement("=", 10, 8) == 0.001);
    console.log(calculate_achivement("=", 10, 12) == 0.001);
    console.log(calculate_achivement("=", 10, 13) == 0.001);

    console.log(calculate_achivement("=", -10, 10) == 0.001);
    console.log(calculate_achivement("=", -10, -10) == 100);
    console.log(calculate_achivement("=", -10, 8) == 0.001);
    console.log(calculate_achivement("=", -10, 12) == 0.001);
    console.log(calculate_achivement("=", -10, 13) == 0.001);
    console.log(calculate_achivement("=", -10, -13) == 0.001);
    console.log(calculate_achivement("=", -10, -8) == 0.001);
    console.log(calculate_achivement("=", -10, -20) == 0.001);
}

// test_calculate_achivement();