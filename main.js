/**
 * main.js
 * 
 * This is the main script file of this project.
 * This file contains all the scripts.
 * 
 * Author: craftermame
 * Created At: 2025/04/20
**/

import { GENERATE_QA } from './data/prompts/generate_qa.js'
import { JSONIFY } from './data/prompts/jsonify.js'
import { TEMPLATE } from './data/template.js'
import { JSON_SAMPLE } from './data/json_sample.js'

document.getElementById('qa-json').placeholder = JSON_SAMPLE

/*
Click Event:
  Copy the prompt that generate Q&A pairs by click button.
  The value `theme` is required.
  The value `keywords` is reqired if keyword generation is not selected.
*/
const copyQaPrompt = document.getElementById('copy-qa-prompt')
copyQaPrompt.addEventListener('click', () => {
  const theme = document.getElementById('theme').value
  if (!theme) { alert('授業のテーマを入力してください。'); return; }
  const keywords = document.getElementById('keywords').value
  const isKwGenerator = !!document.getElementById('generate-keywords').checked
  if (!keywords && !isKwGenerator) { alert('授業のキーワードを入力してください。'); return; }
  const prompt = GENERATE_QA(theme, keywords, isKwGenerator)
  navigator.clipboard.writeText(prompt).then(() => {
    copyQaPrompt.innerText = 'コピーしました'
    console.log('Copied', prompt)
  }).catch(_ => {
    alert('コピーに失敗しました。')
  })
})

/*
Click Event:
  Copy the prompt that convert previous response(Q&A) to JSON format.
*/
const copyJsonifyPrompt = document.getElementById('copy-jsonify-prompt')
copyJsonifyPrompt.addEventListener('click', () => {
  const prompt = JSONIFY
  navigator.clipboard.writeText(prompt).then(() => {
    copyJsonifyPrompt.innerText = 'コピーしました'
    console.log('Copied', prompt)
  }).catch(_ => {
    alert('コピーに失敗しました。')
  })
})

/*
Click Event:
  Create a submission file and download it. 
  While not enough info is extracted, it will use early return.
*/
document.getElementById('download')
.addEventListener('click', async () => {
  const info = extractInfo()
  if (!info) return

  // Create temporary URL.
  document.getElementById('download').disabled = false
  const template = TEMPLATE(
    info.studentId,
    info.studentName,
    info.qa
  )
  const blob = new Blob([template], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'QA.txt'
  a.click()

  URL.revokeObjectURL(url)
})

/**
 * Extracts and returns info object.
 * If a value is invalid, returns `null` at the point.
 * @returns {Object} info object
 */
function extractInfo() {
  const studentId = String(document.getElementById('student-id').value)
  if (!studentId) { alert('学籍番号を入力してください。'); return null; }
  const studentName = String(document.getElementById('student-name').value)
  if (!studentName) { alert('名前を入力してください。'); return null; }
  let qaObj
  try { qaObj = JSON.parse(document.getElementById('qa-json').value) }
  catch (err) { alert('正しい形式のJSONを入力してください。'); return null; }
  let qa
  try { qa = formatQa(qaObj) }
  catch (err) { alert(err); return null; }
  return {
    studentId: studentId,
    studentName: studentName,
    qa: qa
  }
}

/**
 * Returns the formated Q&A pairs.
 * @param {Object} qaJson 
 * @returns {string} The formated Q&A pairs.
 */
function formatQa(qaJson) {
  if (qaJson.length < 5) throw new Error('5つ以上のQ&Aが必要です。')
  return qaJson.map((qa, n) => {
    return `Q${n+1}: ${qa.q}\nA${n+1}: ${qa.a}\n#\n`
  }).join('').replace(/\n#\n$/, '')
}
