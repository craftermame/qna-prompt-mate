
export function TEMPLATE(stundentId, studentName, qa) {

    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()

    return `\
#-----------------------------------------------------------
# [AI基礎] 質問・解答作成
# 年月日: ${year} 年 ${month} 月 ${day} 日
# 注意1:質問，解答ともに，それぞれ200字以内とすること．
# 注意2:質問，解答ともに，改行を入れずに1行に書くこと．
#
# 学籍番号: ${stundentId}
# 名前：${studentName}
#-----------------------------------------------------------
${qa}
#-----------------------------------------------------------

`
}
