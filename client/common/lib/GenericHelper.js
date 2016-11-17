

export function generateRandomColor(index = '#') {
  return index+'0123456789abcdef'.split('').map((v,i,a) => {
    return i>5 ? null : a[Math.floor(Math.random()*16)]
  }).join('')
}

export function generateRandomSetColor(colors = []) {
  let out = colors[ Math.floor( colors.length * Math.random() ) ]
  return out
}
