// removed methods:
// - initObjects
// - recursiveDeepCopy (user angular.copy instead)
// - multiLevelSetter

// renamed mthods:
// - isValidNationalCode => validate.nationalCode
// - isValidLegalNationalCode => validate.legalNationalCode
// - standardizedEnum => arrayEnum
// - isValidJalali => validate.jalali

toolsService.$inject = ["$rootScope", "$location"];
export default function toolsService($rootScope, $location) {
  let service = {
    checkPasswordPolicy: checkPasswordPolicy,
    validate: {
      nationalCode: validateNationalCode,
      legalNationalCode: validateLegalNationalCode,
      email: validateEmail,
      phoneNumber: validatePhoneNumber,
      jalali: validateJalali,
      guid: validateGuid,
      year: validateYear
    },
    extend: extend,
    arrayEnum: arrayEnum,
    convertFarsiNumbers: convertFarsiNumbers,
    groupBy: groupBy,
    randomString: randomString,
    getTreeObject: getTreeObject,
    dateToJalali: dateToJalali,
    jalaliToDate: jalaliToDate,
	monthDiff: monthDiff,
	yearDiff: yearDiff,
	numberToString : numberToString,
    dateRangeOverlaps: dateRangeOverlaps,
    timeToMinutes: timeToMinutes,
    minutesToTime: minutesToTime,
    print: print,
    checkPermission: checkPermission
  };

  return service;

  function checkPasswordPolicy(password) {
    return (
      password && // exists
      password.length >= 8 && // at least 8 character
      /[0-9]/.test(password) && // include number
      parseInt(password) != password
    ); // has at least one non-numeric character
  }
  function validateNationalCode(nationalCode) {
    let check, sum;

    if (nationalCode) {
      nationalCode = service.convertFarsiNumbers(nationalCode);

      if (nationalCode % 1111111111 == 0) return false;

      if (!/^\d{10}$/.test(nationalCode)) return false;

      check = parseInt(nationalCode[9]);
      sum =
        [0, 1, 2, 3, 4, 5, 6, 7, 8]
          .map(x => {
            return parseInt(nationalCode[x]) * (10 - x);
          })
          .reduce((x, y) => {
            return x + y;
          }) % 11;

      return (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11);
    } else return false;
  }
  function monthDiff(d1, d2) {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
  function yearDiff(d1, d2) {
    let years;
    years = (d2.getFullYear() - d1.getFullYear());
    return years <= 0 ? 0 : years;
  }
  function numberToString(num){
	  //https://github.com/mahmoud-eskandari/NumToPersian/
            /**
            * Name:Javascript Number To Persian Convertor.
            * Author:Mahmoud Eskanadri.
            * Copyright:2018 http://Webafrooz.com.
            * Licence: GNU Licence 2.4
            * version:2.0.0
            * Email:info@webafrooz.com,sbs8@yahoo.com
            * coded with ♥ in Webafrooz.
            * big numbers refrence: https://fa.wikipedia.org/wiki/%D9%86%D8%A7%D9%85_%D8%A7%D8%B9%D8%AF%D8%A7%D8%AF_%D8%A8%D8%B2%D8%B1%DA%AF
            **/

            /**
             * A function for converting numbers to persian letters
             * @returns {*}
             * @constructor
             */
            /**
             *
             * @type {string}
             */
            spliter = " و ";

            /**
             *
             * @type {string}
             */
            zero = "صفر";

            /**
             *
             * @type {*[]}
             */
            Letters = [
                ["", "یك", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"],
                ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده", "بیست"],
                ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"],
                ["", "یكصد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"],
                ['', " هزار ", " میلیون ", " میلیارد ", " هزار میلیارد ", " میلیون میلیارد ", " میلیارد میلیارد ", " تریلیارد ",
                    " کوآدریلیون ", " کادریلیارد ", " کوینتیلیون ", " کوانتینیارد ", " سکستیلیون ", " سکستیلیارد ", " سپتیلیون ",
                    " سپتیلیارد ", " اکتیلیون ", " اکتیلیارد ", " نانیلیون ", " نانیلیارد ", " دسیلیون ", " دسیلیارد "]
            ];
			
			return convert(num);

            /**
             * Clear number and split to 3th sections
             * @param {*} num 
             */
            function PrepareNumber(num) {
                if (typeof num === "number") {
                    num = num.toString();
                }
                NumberLength = num.length % 3;
                if (NumberLength === 1) {
                    num = "00" + num;
                } else if (NumberLength === 2) {
                    num = "0" + num;
                }
                //Explode to array
                return num.replace(/\d{3}(?=\d)/g, "$&*").split('*');
            }

            /**
             * Convert 3 numbers into letter
             * @param {*} num 
             */
            function ThreeNumbersToLetter(num) {
                //return zero
                if (parseInt(num) === 0) {
                    return "";
                }
                parsedInt = parseInt(num);
                if (parsedInt < 10) {
                    return Letters[0][parsedInt];
                }
                if (parsedInt <= 20) {
                    return Letters[1][parsedInt - 10];
                }
                if (parsedInt < 100) {
                    one = parsedInt % 10;
                    ten = (parsedInt - one) / 10;
                    if (one > 0) {
                        return Letters[2][ten] + spliter + Letters[0][one];
                    }
                    return Letters[2][ten];
                }
                one = parsedInt % 10;
                hundreds = (parsedInt - parsedInt % 100) / 100;
                ten = (parsedInt - ((hundreds * 100) + one)) / 10;
                out = [Letters[3][hundreds]];
                SecendPart = ((ten * 10) + one);
                if (SecendPart > 0) {
                    if (SecendPart < 10) {
                        out.push(Letters[0][SecendPart]);
                    } else if (SecendPart <= 20) {
                        out.push(Letters[1][SecendPart - 10]);
                    } else {
                        out.push(Letters[2][ten]);
                        if (one > 0) {
                            out.push(Letters[0][one]);
                        }
                    }
                }
                return out.join(spliter);
            }

            /**
             * Main function
             */
            function convert(num) {
                if (num) {
                    //return zero
                    if (parseInt(num) === 0) {
                        return zero;
                    }
                    if (num.length > 66) {
                        return "خارج از محدوده";
                    }
                    //Split to sections
                    SplitedNumber = PrepareNumber(num);

                    //Fetch Sections and convert
                    funcout = [];
                    SplitLength = SplitedNumber.length;
                    for (i = 0; i < SplitLength; i++) {
                        SectionTitle = Letters[4][SplitLength - (i + 1)];
                        converted = ThreeNumbersToLetter(SplitedNumber[i]);
                        if (converted !== "") {
                            funcout.push(converted + SectionTitle);
                        }
                    }
                    return funcout.join(spliter);
                }
                else
                    return '';
            };
  }
  function validateLegalNationalCode(code) {
    code = code + "";
    let c = parseInt(code.substr(10, 1), 10),
      d = parseInt(code.substr(9, 1), 10) + 2,
      z = new Array(29, 27, 23, 19, 17),
      s = 0;

    if (code.length < 11 || parseInt(code, 10) == 0) return false;

    if (parseInt(code.substr(3, 6), 10) == 0) return false;

    for (let i = 0; i < 10; i++) {
      s += (d + parseInt(code.substr(i, 1), 10)) * z[i % 5];
    }

    s = s % 11;
    if (s == 10) s = 0;

    return c == s;
  }
  function validateEmail(email) {
    if (email && email.indexOf("www.") === 0) return false;

    let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }
  function validatePhoneNumber(number) {
    if (!number || (number && (number.length !== 11 || number[0] !== "0")))
      return false;
    else return true;
  }
  function validateGuid(guid) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      guid
    );
  }
  function validateYear(year) {
    if (year >= 1300 && year <= 1450) return true;
    else return false;
  }
  function extend() {
    // source: https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/

    // Pass in the objects to merge as arguments.
    // For a deep extend, set the first argument to `true`.

    // Variables
    let extended = {},
      deep = false,
      i = 0,
      length = arguments.length;

    // Check if a deep merge
    if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
      deep = arguments[0];
      i++;
    }

    // Loop through each object and conduct a merge
    for (; i < length; i++) {
      let obj = arguments[i];
      merge(obj);
    }

    return extended;

    // Merge the object into the extended object
    function merge(obj) {
      for (let prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          // If deep merge and property is an object, merge properties
          if (
            deep &&
            Object.prototype.toString.call(obj[prop]) === "[object Object]"
          )
            extended[prop] = extend(true, extended[prop], obj[prop]);
          else extended[prop] = obj[prop];
        }
      }
    }
  }
  function arrayEnum(enumObject) {
    let result = [];

    for (let key in enumObject) {
      result.push({ ID: parseInt(key), Name: enumObject[key] });
    }

    return result;
  }
  function convertFarsiNumbers(input) {
    if (Object.prototype.toString.call(input) === "[object Array]") {
      for (let i = 0; i < input.length; i++) {
        input[i] = convertFarsiNumbers(input[i]);
      }
    } else if (Object.prototype.toString.call(input) === "[object Object]") {
      for (let key in input) {
        if (input.hasOwnProperty(key))
          input[key] = convertFarsiNumbers(input[key]);
      }
    } else if (Object.prototype.toString.call(input) === "[object String]") {
      input = String(
        input
          .replace(/[٠١٢٣٤٥٦٧٨٩]/g, function(d) {
            return d.charCodeAt(0) - 1632;
          })
          .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function(d) {
            return d.charCodeAt(0) - 1776;
          })
      );
    }

    return input;
  }
  function groupBy(input, keys) {
    let result = [],
      isNew;

    if (input) {
      for (var i = 0; i < input.length; i++) {
        isNew = false;

        for (var j = 0; j < result.length; j++) {
          let allKeysMatch = true;
          for (var k = 0; k < keys.length; k++) {
            if (input[i][keys[k]] != result[j][keys[k]]) allKeysMatch = false;
          }
          if (allKeysMatch) {
            isNew = true;
            result[j].items.push(input[i]);
          }
        }

        if (!isNew) {
          result[j] = { items: [input[i]] };
          for (var r = 0; r < keys.length; r++) {
            result[j][keys[r]] = input[i][keys[r]];
          }
        }
      }
    }

    return result;
  }
  function randomString(length) {
    let chars = [],
      template = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    length = length || 10;
    for (let i = 0; i < length; i++) {
      chars.push(template.charAt(Math.floor(Math.random() * template.length)));
    }

    return chars.join("");
  }
  function getTreeObject(data, primaryIdName, parentIdName, defaultRoot) {
    if (!data || data.length == 0 || !primaryIdName || !parentIdName) return [];

    let tree = [],
      rootIds = [],
      item = data[0],
      primaryKey = item[primaryIdName],
      treeObjs = {},
      tempChildren = {},
      parentId,
      parent,
      len = data.length,
      i = 0;

    while (i < len) {
      item = data[i++];
      primaryKey = item[primaryIdName];

      if (tempChildren[primaryKey]) {
        item.children = tempChildren[primaryKey];
        delete tempChildren[primaryKey];
      }

      treeObjs[primaryKey] = item;
      parentId = item[parentIdName];

      if (parentId && parentId != defaultRoot) {
        parent = treeObjs[parentId];

        if (!parent) {
          let siblings = tempChildren[parentId];
          if (siblings) siblings.push(item);
          else tempChildren[parentId] = [item];
        } else if (parent.children) {
          parent.children.push(item);
        } else {
          parent.children = [item];
        }
      } else {
        rootIds.push(primaryKey);
      }
    }

    for (let i = 0; i < rootIds.length; i++) {
      tree.push(treeObjs[rootIds[i]]);
    }

    return tree;
  }
  function print(elementId) {
    let toPrint = document.getElementById(elementId);
    let popupWin = window.open(
      "",
      "_blank",
      "width=1000,height=800,location=no,left=200px"
    );
    popupWin.document.open();
    popupWin.document.write(
      '<html><title></title><style></style></head><body onload="window.print()">'
    );
    popupWin.document.write(toPrint.innerHTML);
    popupWin.document.write("</html>");
    popupWin.document.close();
  }
  function dateToJalali(date) {
    if (date && date instanceof Date && typeof date.getMonth === "function") {
      return convertToJalali(date);
    } else if (date && typeof date === "string") {
      let dateObject = new Date(date);
      if (dateObject instanceof Date && !isNaN(dateObject))
        return convertToJalali(dateObject);
      else return "";
    } else return "";

    function convertToJalali(date) {
      let jalali = gregorianToJalali(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );

      return (
        jalali[0] + "/" + doubleDigit(jalali[1]) + "/" + doubleDigit(jalali[2])
      );
    }
    function doubleDigit(digit) {
      digit = digit.toString();

      if (digit.length < 2 && digit < 10) return "0" + digit;
      else return digit;
    }
  }
  function jalaliToDate(jalali) {
    let date;

    jalali = jalali.split("/");
    date = toGregorian(
      parseInt(jalali[0]),
      parseInt(jalali[1]),
      parseInt(jalali[2])
    );

    return new Date(date.gy, date.gm - 1, date.gd);
  }
  function validateJalali(jalali) {
    // accepted format: yyyy/mm/dd
    if (jalali && jalali.length == 10) {
      jalali = jalali.split("/");
      if (jalali.length == 3) {
        if (
          jalali[0].length == 4 &&
          !isNaN(parseInt(jalali[0], 10)) &&
          (jalali[1].length == 2 &&
            !isNaN(parseInt(jalali[1], 10)) &&
            parseInt(jalali[1], 10) > 0 &&
            parseInt(jalali[1], 10) < 13) &&
          (jalali[2].length == 2 &&
            !isNaN(parseInt(jalali[2], 10)) &&
            parseInt(jalali[1], 10) > 0 &&
            parseInt(jalali[1], 10) < 32)
        )
          return true;
      }
    }

    return false;
  }
  function dateRangeOverlaps(range1, range2) {
    return range1[0] <= range2[1] && range1[1] >= range2[0];
  }
  function timeToMinutes(time) {
    if (time) {
      var hour, minutes;
      hour = parseInt(time.split(":")[0]);
      minutes = parseInt(time.split(":")[1]);
      minutes += hour * 60;
      return minutes;
    } else {
      return 0;
    }
  }
  function minutesToTime(minutes) {
    if (!minutes) return "";

    var h, m;
    h = Math.floor(minutes / 60);
    m = Math.round(minutes % 60);
    if (h < 10) {
      h = "0" + h;
    } else {
      h = h + "";
    }
    if (m < 10) {
      m = "0" + m;
    } else {
      m = m + "";
    }
    return h + ":" + m;
  }
  function checkPermission(input, options) {
    let isAuthorized;

    options = options || {};

    if (typeof input === "string")
      isAuthorized =
        $rootScope.permissions &&
        $rootScope.permissions.some(e => {
          return e.Name === input;
        });
    else if (Object.prototype.toString.call(input) === "[object Array]") {
      for (let i = 0; i < $rootScope.permissions.length; i++) {
        const permission = $rootScope.permissions[i];

        for (let j = 0; j < input.length; j++) {
          const name = input[j];

          if (permission.Name === name) {
            isAuthorized = true;
            break;
          }
        }

        if (isAuthorized) break;
      }
    }

    if (!isAuthorized && options.notFound) $location.path("not-found");

    return isAuthorized;
  }

  function gregorianToJalali(a, r, s) {
    var g_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      j_days = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    (a = parseInt(a)), (r = parseInt(r)), (s = parseInt(s));
    for (
      var n = a - 1600,
        e = r - 1,
        t = s - 1,
        p =
          365 * n +
          parseInt((n + 3) / 4) -
          parseInt((n + 99) / 100) +
          parseInt((n + 399) / 400),
        I = 0;
      e > I;
      ++I
    )
      p += g_days[I];
    e > 1 && ((n % 4 == 0 && n % 100 != 0) || n % 400 == 0) && ++p, (p += t);
    var v = p - 79,
      d = parseInt(v / 12053);
    v %= 12053;
    var o = 979 + 33 * d + 4 * parseInt(v / 1461);
    (v %= 1461),
      v >= 366 && ((o += parseInt((v - 1) / 365)), (v = (v - 1) % 365));
    for (var I = 0; 11 > I && v >= j_days[I]; ++I) v -= j_days[I];
    var y = I + 1,
      _ = v + 1;
    return [o, y, _];
  }
  function toJalaali(d, i, a) {
    return d2j(g2d(d, i, a));
  }
  function toGregorian(d, i, a) {
    return d2g(j2d(d, i, a));
  }
  function isValidJalaaliDate(d, i, a) {
    return (
      d >= -61 &&
      3177 >= d &&
      i >= 1 &&
      12 >= i &&
      a >= 1 &&
      a <= jalaaliMonthLength(d, i)
    );
  }
  function isLeapJalaaliYear(d) {
    return 0 === jalCal(d).leap;
  }
  function jalaaliMonthLength(d, i) {
    return 6 >= i ? 31 : 11 >= i ? 30 : isLeapJalaaliYear(d) ? 30 : 29;
  }
  function jalCal(d) {
    var i,
      a,
      n,
      r,
      t,
      o,
      v,
      e = [
        -61,
        9,
        38,
        199,
        426,
        686,
        756,
        818,
        1111,
        1181,
        1210,
        1635,
        2060,
        2097,
        2192,
        2262,
        2324,
        2394,
        2456,
        3178
      ],
      l = e.length,
      u = d + 621,
      m = -14,
      g = e[0];
    if (g > d || d >= e[l - 1]) throw new Error("Invalid Jalaali year " + d);
    for (v = 1; l > v && ((i = e[v]), (a = i - g), !(i > d)); v += 1)
      (m = m + 8 * div(a, 33) + div(mod(a, 33), 4)), (g = i);
    return (
      (o = d - g),
      (m = m + 8 * div(o, 33) + div(mod(o, 33) + 3, 4)),
      4 === mod(a, 33) && a - o === 4 && (m += 1),
      (r = div(u, 4) - div(3 * (div(u, 100) + 1), 4) - 150),
      (t = 20 + m - r),
      6 > a - o && (o = o - a + 33 * div(a + 4, 33)),
      (n = mod(mod(o + 1, 33) - 1, 4)),
      -1 === n && (n = 4),
      { leap: n, gy: u, march: t }
    );
  }
  function j2d(d, i, a) {
    var n = jalCal(d);
    return g2d(n.gy, 3, n.march) + 31 * (i - 1) - div(i, 7) * (i - 7) + a - 1;
  }
  function d2j(d) {
    var i,
      a,
      n,
      r = d2g(d).gy,
      t = r - 621,
      o = jalCal(t),
      v = g2d(r, 3, o.march);
    if (((n = d - v), n >= 0)) {
      if (185 >= n)
        return (
          (a = 1 + div(n, 31)), (i = mod(n, 31) + 1), { jy: t, jm: a, jd: i }
        );
      n -= 186;
    } else (t -= 1), (n += 179), 1 === o.leap && (n += 1);
    return (a = 7 + div(n, 30)), (i = mod(n, 30) + 1), { jy: t, jm: a, jd: i };
  }
  function g2d(d, i, a) {
    var n =
      div(1461 * (d + div(i - 8, 6) + 100100), 4) +
      div(153 * mod(i + 9, 12) + 2, 5) +
      a -
      34840408;
    return (n = n - div(3 * div(d + 100100 + div(i - 8, 6), 100), 4) + 752);
  }
  function d2g(d) {
    var i, a, n, r, t;
    return (
      (i = 4 * d + 139361631),
      (i = i + 4 * div(3 * div(4 * d + 183187720, 146097), 4) - 3908),
      (a = 5 * div(mod(i, 1461), 4) + 308),
      (n = div(mod(a, 153), 5) + 1),
      (r = mod(div(a, 153), 12) + 1),
      (t = div(i, 1461) - 100100 + div(8 - r, 6)),
      { gy: t, gm: r, gd: n }
    );
  }
  function div(d, i) {
    return ~~(d / i);
  }
  function mod(d, i) {
    return d - ~~(d / i) * i;
  }
}
