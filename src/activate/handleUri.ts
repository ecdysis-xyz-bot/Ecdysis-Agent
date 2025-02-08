import * as vscode from "vscode"
import delay from "delay"
import { ClineProvider } from "../core/webview/ClineProvider"

export const handleUri = async (uri: vscode.Uri) => {
	const path = uri.path
	const query = new URLSearchParams(uri.query.replace(/\+/g, "%2B"))

	// まずサイドバーを表示
	await vscode.commands.executeCommand("workbench.view.extension.ecdysis-agent-ActivityBar")
	await delay(1000) // サイドバーの表示を待つ

	// サイドバーにフォーカスを当てる
	await vscode.commands.executeCommand("ecdysis-agent.SidebarProvider.focus")
	await delay(1000) // フォーカスの設定を待つ

	let provider = ClineProvider.getVisibleInstance()

	if (!provider) {
		// 2回目の試行
		provider = await ClineProvider.getInstance()
		if (!provider) {
			vscode.window.showErrorMessage("Failed to initialize Ecdysis Agent")
			return
		}
	}

	switch (path) {
		case "/glama": {
			const code = query.get("code")
			if (code) {
				await provider.handleGlamaCallback(code)
			}
			break
		}
		case "/openrouter": {
			const code = query.get("code")
			if (code) {
				await provider.handleOpenRouterCallback(code)
			}
			break
		}
		case "/task": {
			const taskDescription = query.get("description")
			if (taskDescription) {
				await provider.handleNewTask(decodeURIComponent(taskDescription))
			}
			break
		}
		default:
			break
	}
}
