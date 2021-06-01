// 此为react16版本，17版本不会自动调用这了
function createElement(type, props, ...children) {
  console.log('react-createElement', type, props, children)
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => (typeof child === 'object' ? child : createTextNode(child))),
    },
  }
}

function createTextNode(text) {
  return {
    type: 'TEXT',
    props: {
      children: [],
      nodeValue: text,
    },
  }
}

export default { createElement }
