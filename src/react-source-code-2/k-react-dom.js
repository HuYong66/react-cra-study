// 下一个子任务
let nextUnitOfWork = null
// work in progress
let wipRoot = null
let currentRoot = null

// 当前正在工作的fiber
let wipFiber = null
let hookIndex = null

// 存放删除fiber的数组，最后提交的时候进行统一提交，不要忘记每次进行初始化
let deletions = null

function render(vnode, container) {
  console.log('render', vnode)
  wipRoot = {
    node: container,
    type: 'div',
    props: { children: [vnode] },
    base: currentRoot,
  }
  deletions = []
  nextUnitOfWork = wipRoot
}

// 调度diff或者是渲染任务
function workLoop(deadline) {
  // 有下⼀个任务，并且当前帧还没有结束
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  if (!nextUnitOfWork && wipRoot) {
    // 提交
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

// 执行任务
function performUnitOfWork(fiber) {
  // 1. 执⾏当前任务
  // 更新当前
  const { type } = fiber
  // console.log('fiber1: ', fiber)
  if (typeof type === 'function') {
    type.prototype.isReactComponent ? updateClassComponent(fiber) : updateFunctionComponent(fiber)
  } else if (typeof type === 'symbol') {
    updateFragmentComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }
  // console.log('fiber2: ', fiber)

  // 2.返回再下⼀个任务
  // 找下个任务的原则：先找⼦元素
  if (fiber.child) {
    return fiber.child
  }
  // 如果没有⼦元素，寻找兄弟元素
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
  return null
}

function updateFunctionComponent(fiber) {
  wipFiber = fiber
  wipFiber.hooks = []
  hookIndex = 0
  const { type, props } = fiber
  const children = [type(props)]
  reconcilerChildren(fiber, children)
}

function updateClassComponent(fiber) {
  const { type: Type, props } = fiber
  const cmp = new Type(props) // 实例化
  const children = [cmp.render()]
  reconcilerChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.node) {
    fiber.node = createNode(fiber)
  }
  let { children = [] } = fiber.props || {}
  if (!children) return
  if (!Array.isArray(children)) {
    children = [children]
  }
  reconcilerChildren(fiber, children)
}

function updateFragmentComponent(fiber) {
  const { children } = fiber.props
  reconcilerChildren(fiber, children)
}

// 递归创建子节点
function reconcilerChildren(workInProgressFiber, children) {
  const newChildren = []
  // 处理数组形式child
  children.forEach((child) => {
    if (Array.isArray(child)) {
      newChildren.push(...child)
    } else {
      newChildren.push(child)
    }
  })

  // 构建fiber结构
  // 这⾥的构建是按照顺序的，没有考虑移动位置等等
  // 更新 删除 新增
  let oldFiber = workInProgressFiber.base && workInProgressFiber.base.child
  let prevSibling = null
  for (let i = 0; i < newChildren.length; i++) {
    const child = newChildren[i]
    let newFiber = null
    // 文本节点特殊处理
    let textProps
    if (typeof child !== 'object') {
      textProps = { nodeValue: child }
    }
    const sameType = child && oldFiber && child.type === oldFiber.type
    // console.log('比较', sameType, child, oldFiber)
    if (sameType) {
      // 复用 update
      newFiber = {
        type: oldFiber.type,
        props: child.props || textProps,
        node: oldFiber.node,
        // nodeValue: typeof child !== 'object' ? child : undefined,
        base: oldFiber,
        parent: workInProgressFiber,
        effectTag: 'UPDATE',
      }
    }
    if (!sameType && child) {
      // 新增
      newFiber = {
        type: child.type,
        props: child.props || textProps,
        node: null, // 真实dom节点
        // nodeValue: typeof child !== 'object' ? child : undefined,
        base: null, // 存储fiber,便于去比较
        parent: workInProgressFiber,
        effectTag: 'PLACEMENT',
      }
    }
    if (!sameType && oldFiber) {
      // 删除, 每次push打了删除标记tag的fiber进去，最后同意提交
      console.log('delete')
      oldFiber.effectTag = 'DELETE'
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
    // 形成链表结构
    if (i === 0) {
      workInProgressFiber.child = newFiber
    } else {
      // i>0
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
  }
  // fiber结构构建 done
}

function commitRoot() {
  deletions.forEach(commitWorker)
  commitWorker(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitWorker(fiber) {
  if (!fiber) {
    return
  }
  // 向上查找
  let parentNodeFiber = fiber.parent
  while (!parentNodeFiber.node) {
    parentNodeFiber = parentNodeFiber.parent
  }
  const parentNode = parentNodeFiber.node
  if (fiber.effectTag === 'PLACEMENT' && fiber.node !== null) {
    parentNode.appendChild(fiber.node)
  } else if (fiber.effectTag === 'UPDATE' && fiber.node !== null) {
    updateNode(fiber.node, fiber.base.props, fiber.props)
  } else if (fiber.effectTag === 'DELETE' && fiber.node !== null) {
    commitDeletions(fiber, parentNode)
  }
  commitWorker(fiber.child)
  commitWorker(fiber.sibling)
}

function commitDeletions(fiber, parentNode) {
  if (fiber.node) {
    parentNode.removeChild(fiber.node)
  } else {
    commitDeletions(fiber.child, parentNode)
  }
}

function createNode(vnode) {
  const { type, props } = vnode
  let node
  // console.log('createNode1', vnode, props)
  if (!type) {
    node = document.createTextNode(vnode.nodeValue)
  } else {
    node = document.createElement(type)
  }
  // 节点赋值
  updateNode(node, {}, props)

  // if (props && props.children) {
  //   reconcilerChildren(props.children, node)
  // }
  return node
}

// 节点赋值
function updateNode(node, preProps, props) {
  preProps
    && Object.keys(preProps)
      .filter((key) => key !== 'children')
      .forEach((key) => {
        if (key.slice(0, 2) === 'on') {
          // 移除事件
          const eventName = key.slice(2).toLocaleLowerCase()
          node.removeEventListener(eventName, preProps[key])
        } else if (!(key in props)) {
          node[key] = ''
        }
      })
  props
    && Object.keys(props)
      .filter((key) => key !== 'children')
      .forEach((key) => {
        if (key.slice(0, 2) === 'on') {
          // 以on开头就认为是一个事件，源码处理复杂一些，使用事件委托
          const eventName = key.slice(2).toLocaleLowerCase()
          node.addEventListener(eventName, props[key])
        } else {
          // console.log('更新node', node, props)
          node[key] = props[key]
        }
      })
}

export function useState(init) {
  // 第⼀次进来⽤init赋值
  const oldHook = wipFiber.base && wipFiber.base.hooks[hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : init,
    queue: [], // 更新队列，是setState加入的action,比如连续的setState操作，都会存入这里
  }
  const actions = oldHook ? oldHook.queue : [] // setState 加入的action在上一次渲染的hook队列里，所以要从老hook拿
  actions.forEach((action) => {
    console.log('遍历action', typeof action)
    if (typeof action === 'function') {
      hook.state = action(hook.state)
    } else {
      hook.state = action
    }
  })
  const setState = (action) => {
    // 启动任务更新
    hook.queue.push(action)
    wipRoot = {
      node: currentRoot.node,
      props: currentRoot.props,
      base: currentRoot,
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }
  wipFiber.hooks.push(hook)
  console.log('hook', hook) // sy-log
  hookIndex++
  // 下⼀次进来就要更新了
  return [hook.state, setState]
}

export default { render }
