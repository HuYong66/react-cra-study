function render(vnode, container) {
  // console.log('vnode: ', vnode, container)
  // return null
  const node = createNode(vnode)
  // console.log('挂载', node, container)
  container.appendChild(node)
}

function createNode(vnode) {
  const { type, props } = vnode
  let node
  console.log('createNode1', vnode, props)
  if (typeof type === 'function') {
    // node = type.isReactComponent ? createClassNode(vnode) : createFuncNode(vnode)
    node = type.prototype.isReactComponent ? createClassNode(vnode) : createFuncNode(vnode)
  } else if (!type) {
    node = document.createTextNode(vnode)
  } else if (typeof type === 'symbol') { // <></>处理
    node = document.createDocumentFragment()
  } else {
    node = document.createElement(type)
  }
  // console.log('createNode2', node, props)
  // 节点赋值
  updateNode(node, props)

  if (props && props.children) {
    reconcilerChildren(props.children, node)
  }
  return node
}

// 递归创建子节点
function reconcilerChildren(children, node) {
  // console.log('children', children, node)
  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((chi) => {
          render(chi, node)
        })
      } else {
        render(child, node)
      }
    })
  } else if (children) {
    render(children, node)
  }
}

// 节点赋值
function updateNode(node, props) {
  props && Object.keys(props).filter((key) => key !== 'children').forEach((key) => {
    if (key.slice(0, 2) === 'on') {
      // 以on开头就认为是一个事件，源码处理复杂一些
      const eventName = key.slice(2).toLocaleLowerCase()
      node.addEventListener(eventName, props[key])
    } else {
      node[key] = props[key]
    }
  })
}

// 函数组件创建节点
function createFuncNode(vnode) {
  const { type, props } = vnode
  const vvnode = type(props)
  const node = createNode(vvnode)
  return node
}

// class组件创建节点
function createClassNode(vnode) {
  const { type: Type, props } = vnode
  const cmp = new Type(props)
  const vvnode = cmp.render()
  const node = createNode(vvnode)
  return node
}

export default { render }
