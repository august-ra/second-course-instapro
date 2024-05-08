
/**
 * Функция выводит единицы измерения для числа, когда нужна начальная форма существительного (именительный падеж, редко винительный)
 * Пример: 0 дорог, 1 дорога, 2 дороги, 3 дороги, 4 дороги, 5 дорог и так далее
 * Работа функции заключается в том, чтобы найти и вывести подходящее значение для последней цифры
 * Когда число оканчивается на 1 (unit_1), на 2—4 (unit_2) и по общему правилу на одну из оставшихся цифр (0 и 5—9) (unit_0)
 * Исключением будут цифры, оканчивающиеся на 11—14 — они идут по общему правилу (unit_0)
 */
Number.prototype.withUnits = function (unit_0, unit_1, unit_2) {
  let reminder = this % 100

  if (reminder >= 11 && reminder <= 19)
    return unit_0

  reminder = reminder % 10

  if (reminder === 1)
    return unit_1
  else if (reminder >= 2 && reminder <= 4)
    return unit_2
  else
    return unit_0
}

/**
 * функция выводит единицы измерения для числа, когда нужна форма существительного не в именительном падеже
 * Пример: по 0 дорог, по 1 дороге, по 2 дорогам, по 3 дорогам и так далее
 * Работа функции заключается в том, чтобы найти и вывести подходящее значение для последней цифры
 * Когда число оканчивается на 0 (unit_0), на 1 (unit_1) и на любую другую цифру (2—9)
 */
Number.prototype.withUnitsInGrammaticalCase = function (unit_0, unit_1, unit_2) {
  if (this === 0)
    return unit_0

  let reminder = this % 10

  if (reminder === 1)
    return unit_1
  else
    return unit_2
}

/**
 * Функция выводит текст без HTML-тегов, заменяя служебные символы разметки кодами этих символов
 */
String.prototype.sterilize = function () {
  return this
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("/", "&sol;")
}

/**
 * Функция выводит многострочный текст, где переносы строк заменены валидным HTML-тегом <br>
 */
String.prototype.formatText = function () {
  const text = this
    .sterilize()
    .replaceAll("&amp;sol;", "/")
    .replaceAll("&sol;", "/")
    .replaceAll("=>", "&rArr;")
    .replaceAll("=&gt;", "&rArr;")
    .replaceAll("=&amp;gt;", "&rArr;")

  const lines = text.split("\n")
  return lines.join("<br>")
}
