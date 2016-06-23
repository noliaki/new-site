const hoge = 'fuga'
console.log(hoge)

let prom1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 1000)
}).then(() => {
  console.log('prom1 DONE')
})

let prom2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 300)
}).then(() => {
  console.log('prom2 DONE')
})

let prom3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 2000)
}).then(() => {
  console.log('prom3 DONE')
})

let prom4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 500)
}).then(() => {
  console.log('prom4 DONE')
})

Promise.all([
  prom1,
  prom2,
  prom3,
  prom4
]).then(() => {
  console.log('ALL DONE')
})

const arr = [
  'hoge',
  'piyo',
  'fuga',
  1, 2, 3, 4, 5, 5, 6, 7, 7, 23, 42, 51, 534, 3245, 32, 5, 3245, 34, 52, 345
]

let arrFind = arr.find((item) => {
  return typeof item === 'string'
})

let arrFindIndex = arr.findIndex((item) => {
  return typeof item === 'string'
})

console.log(arrFind)
console.log(arrFindIndex)
