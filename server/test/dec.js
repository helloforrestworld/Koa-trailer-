// @ask
// class Boy {
//   // @speak
//   // @add('somgthing')
//   run() {
//     console.log('i can run')
//     console.log(this.something)
//   }
// }

// function speak(target, key, descriptor) {
//   console.log(target)
//   console.log(key)
//   console.log(descriptor)
//   return descriptor
// }
// // 
// function ask(target, key, descriptor) {
//   console.log(target)
//   console.log(key)
//   console.log(descriptor)
//   return descriptor
// }

// function add(something) {
//   return function(target, key, descriptor) {
//     console.log(target)
//     console.log(key)
//     console.log(descriptor)
//     target.something = something
//     return descriptor
//   }
// }

// const luk = new Boy() 
// 
// luk.run()


function dec(id){
  console.log('evaluated', id);
  return (target, property, descriptor) => console.log('executed', id);
}

class Example {
    @dec(1)
    @dec(2)
    method(){}
}
console.log('can i go first')
let e1 = new Example()
e1.method()

