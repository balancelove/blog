# parseHTML

```js
export function parseHTML (html, options) {
  // 记录解析 root
  const stack = []
  const expectHTML = options.expectHTML
  const isUnaryTag = options.isUnaryTag || no
  const canBeLeftOpenTag = options.canBeLeftOpenTag || no
  // 记录索引位置
  let index = 0
  // 剩余 template
  let last, lastTag
  // 参数: template
  while (html) {
    // 剩余部分的 template
    last = html
    // 不是最后一个标签,并且不是 script,style,textarea 这几个标签
    if (!lastTag || !isPlainTextElement(lastTag)) {
      // 如果 '<' 的索引是 0 的话
      // 就有以下几种情况
      let textEnd = html.indexOf('<')
      if (textEnd === 0) {
        // 注释: <!--
        if (comment.test(html)) {
          const commentEnd = html.indexOf('-->')

          if (commentEnd >= 0) {
            // 根据我们传的是否保留注释的参数决定是否保留注释
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd))
            }
            // 截取模板
            advance(commentEnd + 3)
            continue
          }
        }

        // 条件注释
        if (conditionalComment.test(html)) {
          ...
        }

        // Doctype: <!DOCTYPE html>
        const doctypeMatch = html.match(doctype)
        if (doctypeMatch) {
          ...
        }

        // 结束标签: </div>
        const endTagMatch = html.match(endTag)
        if (endTagMatch) {
           ...
        }

        // 开始标签: <div>
        // 得到解析出的开始标签
        const startTagMatch = parseStartTag()
        if (startTagMatch) {
          // 如果有解析的数据，则开始处理 match
          handleStartTag(startTagMatch)
          // 兼容性处理
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1)
          }
          // 当前这一部分就解析完了
          continue
        }
      }

      // 如果大于等于 0，则没有上面的那些东西了
      // 那么就会是一些文本、表达式之类的
      let text, rest, next
      if (textEnd >= 0) {
        ...
      }

      // 到这里就认为 html 已经结束了，只剩处理一些文本了
      if (textEnd < 0) {
        text = html
        html = ''
      }

      if (options.chars && text) {
        options.chars(text)
      }
    } else {
      // 如果 lastTag 存在 或者是 script,style,textarea
      ...
    }

    if (html === last) {
      options.chars && options.chars(html)
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) {
        options.warn(`Mal-formatted tag at end of template: "${html}"`)
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag()

  // 从 html 中扔掉 n 个长度的字符串
  function advance (n) {
    index += n
    html = html.substring(n)
  }

  // 解析起始标签
  function parseStartTag () {
    // 使用正则匹配
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1], // 标签名
        attrs: [], // 属性初始化成空数组
        start: index // 索引
      }
      // 将开始标签从 html 中扔掉
      advance(start[0].length)
      let end, attr
      // 循环获取这个标签里的属性
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push(attr)
      }
      // 当匹配到开始标签结束了的时候，执行下面的代码
      if (end) {
        // 判断是不是一元标签
        match.unarySlash = end[1]
        advance(end[0].length)
        // 将结束的索引存到 end 中
        match.end = index
        return match
      }
    }
  }

  // 处理开始标签
  function handleStartTag (match) {
    // 取得标签名
    const tagName = match.tagName
    // 一元标签匹配到 '/'，否则是 ''
    const unarySlash = match.unarySlash

    // 下面是对结束标签做处理的
    if (expectHTML) {
      // 判断 lastTag 是不是 p 标签或者段落元素标签，有一大长串，想看的可以在下面看看
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag)
      }
      // colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source
      if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
        parseEndTag(tagName)
      }
    }

    // 判断是不是一元标签，自定义的也能检测，通过后面的表达式
    const unary = isUnaryTag(tagName) || !!unarySlash

    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      // 兼容性处理
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3] }
        if (args[4] === '') { delete args[4] }
        if (args[5] === '') { delete args[5] }
      }
      const value = args[3] || args[4] || args[5] || ''
      const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      }
    }

    // 如果不是一元标签，就 push 到 stack 里面
    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs })
      lastTag = tagName
    }

    if (options.start) {
      // 这才是正儿八经的处理工作,关于这个函数请看下面的 start
      // 这里有一个疑惑，就是实际上 start 函数只接受 3 个参数，后面两个好像传了也没啥用，不知道为啥
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }

  function parseEndTag (tagName, start, end) {
    ...
  }
}
```



```js
export const isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
)
```

## start

```js
start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      // 检查命名空间，如果存在父类命名空间就继承
      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

      // 处理 IE svg 的 bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs)
      }

      // 生成 ASTElement
      let element: ASTElement = createASTElement(tag, attrs, currentParent)
      if (ns) {
        element.ns = ns
      }

      // 是否是禁止元素,script、style
      // 是不是服务端渲染
      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true
        process.env.NODE_ENV !== 'production' && warn(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          `<${tag}>` + ', as they will not be parsed.'
        )
      }

      // 这里主要是检查是不是 input，以及有没有 v-model 属性，没有就不会做任何操作
      for (let i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element
      }

      // 默认为 false
      // 如果这个属性为 true 就会跳过这个编译过程，显示 {{}} 标签，可以优化编译过程
      if (!inVPre) {
        processPre(element)
        if (element.pre) {
          inVPre = true
        }
      }
      // 判断是不是 pre 标签
      if (platformIsPreTag(element.tag)) {
        inPre = true
      }
      if (inVPre) {
        processRawAttrs(element)
        // 元素是否被处理过
      } else if (!element.processed) {
        // structural directives
        // 处理 v-for 指令
        processFor(element)
        // 处理 v-if 指令
        processIf(element)
        // 处理 v-once 指令
        processOnce(element)
        // element-scope stuff
        // 处理一些其他的属性
        processElement(element, options)
      }

      function checkRootConstraints (el) {
        if (process.env.NODE_ENV !== 'production') {
          // 不能将 slot 或者 template 作为 root
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              `Cannot use <${el.tag}> as component root element because it may ` +
              'contain multiple nodes.'
            )
          }
          // root 上不能使用 v-for 指令
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            )
          }
        }
      }

      // tree management
      // 这里是看是否存在 root 根节点
      if (!root) {
        // 赋值根节点
        root = element
        // 检查树
        checkRootConstraints(root)
      } else if (!stack.length) {
        // 允许 root 元素使用 v-if, v-else-if 和 v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element)
          // 添加 if 的条件语句
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          })
        } else if (process.env.NODE_ENV !== 'production') {
          warnOnce(
            `Component template should contain exactly one root element. ` +
            `If you are using v-if on multiple elements, ` +
            `use v-else-if to chain them instead.`
          )
        }
      }
      // 如果当前存在父节点，并且不是禁止元素，就进行一些操作添加子元素
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent)
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false
          const name = element.slotTarget || '"default"'
          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
        } else {
          currentParent.children.push(element)
          element.parent = currentParent
        }
      }
      // 如果不是一元标签就把这个元素赋值成父元素
      if (!unary) {
        currentParent = element
        stack.push(element)
      } else {
        closeElement(element)
      }
    }
```

