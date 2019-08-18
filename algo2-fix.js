export default (str, words) => {
  // 计算字符串的总长度
  let strLen = str.length
  // 计算所有的单词数量
  let wordsLen = words.length
  // 计算所有单词出现的起始位置和截止位置
  let pos = {}
  // 如果字符串的长度小于所有单词的总长度直接返回
  if (strLen < words.join('').length) {
    return []
  }
  // 遍历所有单词查找在字符串中的起始位置和截止位置
  words.every(word => {
    if (pos[word]) {
      return true
    }
    let wl = word.length
    let tmp = []
    for (let i = 0, len = strLen - wl, idx; i <= len; i++) {
      idx = str.slice(i).indexOf(word)
      if (idx > -1) {
        if (idx === 0) {
          tmp.push({
            start: i,
            end: i + wl
          })
        } else if (str[i + 1] !== word[0]) {
          i += idx - 1
        }
      } else {
        break
      }
    }
    // 如果没有匹配到单词终止遍历
    if (tmp[0] === undefined) {
      return false
    } else {
      // 保存当前单词的位置，遍历下一个单词
      pos[word] = tmp.sort((a, b) => a.start - b.start)
      return true
    }
  })
  // 只要有一个单词没找到说明不能匹配到连续的字符串
  if (words.find(item => !pos[item])) {
    return []
  }
  let result = []
  // 计算所有单词的位置
  let match = (poses) => {
    // 记录是不是所有单词都被匹配到了，每一次都应该把所有单词都包括进来并且是相邻的
    let record = []
    let len = Object.keys(poses).length
    // 如果没有单词的位置说明处理结束了
    if (len < 1) {
      return -1
    }
    while (1) {
      // 每次循环应该把记录清空
      record.length = 0
      // 按照起始位置进行升序排序
      let minV = Number.MAX_SAFE_INTEGER
      let minK = ''
      // 优先找到所有单词其实位置最小的单词开始匹配
      for (let [k, v] of Object.entries(poses)) {
        if (!v.length) {
          return false
        } else {
          if (v[0].start < minV) {
            minK = k
            minV = v[0].start
          }
        }
      }
      if (!minK) {
        return false
      }
      // 起始位置最小的单词
      let first = poses[minK].shift()
      if (!first) {
        return false
      }
      // 记录下这个起始位置
      let start = first.start
      // 记录words列表中的单词
      record.push(words.findIndex(item => item === minK))
      // 每次循环要匹配到所有单词
      for (let i = 1; i < wordsLen; i++) {
        for (let j = 0, next; j < wordsLen; j++) {
          if (record.includes(j)) {
            continue
          }
          if (poses[words[j]][0] === undefined) {
            return false
          }
          next = poses[words[j]].find(item => item.start === first.end)
          if (next) {
            record.push(j)
            first = next
            break
          }
        }
      }
      // 如果所有单词的顺序是挨着的，记录下当前的起始位置
      if (record.length === wordsLen && !record.find(item => item === undefined)) {
        result.push(start)
      }
    }
  }
  match(pos)
  // 对 result 去重，如 result=[1,1,2,3] [...new Set(result)]===[1,2,3]
  return [...new Set(result)]
}
