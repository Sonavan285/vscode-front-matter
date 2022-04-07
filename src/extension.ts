import * as vscode from 'vscode';
import { Telemetry } from './helpers/Telemetry';
import { ContentType } from './helpers/ContentType';
import { Dashboard } from './commands/Dashboard';
import { Article, Settings, StatusListener } from './commands';
import { Folders } from './commands/Folders';
import { Preview } from './commands/Preview';
import { Project } from './commands/Project';
import { Template } from './commands/Template';
import { COMMAND_NAME, TelemetryEvent } from './constants';
import { TaxonomyType } from './models';
import { MarkdownFoldingProvider } from './providers/MarkdownFoldingProvider';
import { TagType } from './panelWebView/TagType';
import { ExplorerView } from './explorerView/ExplorerView';
import { Extension } from './helpers/Extension';
import { DashboardData } from './models/DashboardData';
import { Logger, Settings as SettingsHelper } from './helpers';
import { Content } from './commands/Content';
import ContentProvider from './providers/ContentProvider';
import { Wysiwyg } from './commands/Wysiwyg';
import { Diagnostics } from './commands/Diagnostics';
import { PagesListener } from './listeners/dashboard';
import { Backers } from './commands/Backers';
import { DataListener, SettingsListener } from './listeners/panel';
import { NavigationType } from './dashboardWebView/models';
import { ModeSwitch } from './services/ModeSwitch';

let frontMatterStatusBar: vscode.StatusBarItem;
let statusDebouncer: { (fnc: any, time: number): void; };
let editDebounce: { (fnc: any, time: number): void; };
let collection: vscode.DiagnosticCollection;

export async function activate(context: vscode.ExtensionContext) {
	const { subscriptions, extensionUri, extensionPath } = context;

	const extension = Extension.getInstance(context);
	Backers.init(context);

	if (!extension.checkIfExtensionCanRun()) {
		return undefined;
	}
	
	SettingsHelper.init();
	extension.migrateSettings();
	
	SettingsHelper.checkToPromote();

	// Sends the activation event
	Telemetry.send(TelemetryEvent.activate);

	// Start listening to the folders for content changes.
	// This will make sure the dashboard is up to date
	PagesListener.startWatchers();

	collection = vscode.languages.createDiagnosticCollection('frontMatter');

	// Pages dashboard
	Dashboard.init();
	subscriptions.push(vscode.commands.registerCommand(COMMAND_NAME.dashboard, (data?: DashboardData) => {
		Telemetry.send(TelemetryEvent.openContentDashboard);
		if (!data) {
			Dashboard.open({ type: NavigationType.Contents });
		} else {
			Dashboard.open(data);
		}
	}));
	
	subscriptions.push(vscode.commands.registerCommand(COMMAND_NAME.dashboardMedia, (data?: DashboardData) => {
		Telemetry.send(TelemetryEvent.openMediaDashboard);
		Dashboard.open({ type: NavigationType.Media });
	}));
	
	subscriptions.push(vscode.commands.registerCommand(COMMAND_NAME.dashboardSnippets, (data?: DashboardData) => {
		Telemetry.send(TelemetryEvent.openSnippetsDashboard);
		Dashboard.open({ type: NavigationType.Snippets });
	}));
	
	subscriptions.push(vscode.commands.registerCommand(COMMAND_NAME.dashboardData, (data?: DashboardData) => {
		Telemetry.send(TelemetryEvent.openDataDashboard);
		Dashboard.open({ type: NavigationType.Data });
	}));
	
	subscriptions.push(vscode.commands.registerCommand(COMMAND_NAME.dashboardClose, (data?: DashboardData) => {
		Telemetry.send(TelemetryEvent.closeDashboard);
		Dashboard.close();
	}));

	if (!extension.getVersion().usedVersion) {
		vscode.commands.executeCommand(COMMAND_NAME.dashboard);
	}

	// Register the explorer view
	const explorerSidebar = ExplorerView.getInstance(extensionUri);
	const explorerView = vscode.window.registerWebviewViewProvider(ExplorerView.viewType, explorerSidebar, {
		webviewOptions: {
			retainContextWhenHidden: true
		}
	});

	// Folding the front matter of markdown files
	MarkdownFoldingProvider.register();

	const insertTags = vscode.commands.registerCommand(COMMAND_NAME.insertTags, async () => {
		await vscode.commands.executeCommand('workbench.view.extension.frontmatter-explorer');
		await vscode.commands.executeCommand('workbench.action.focusSideBar');
		explorerSidebar.triggerInputFocus(TagType.tags);
	});

	const insertCategories = vscode.commands.registerCommand(COMMAND_NAME.insertCategories, async () => {
		await vscode.commands.executeCommand('workbench.view.extension.frontmatter-explorer');
		await vscode.commands.executeCommand('workbench.action.focusSideBar');
		explorerSidebar.triggerInputFocus(TagType.categories);
	});

	const createTag = vscode.commands.registerCommand(COMMAND_NAME.createTag, () => {
		Settings.create(TaxonomyType.Tag);
	});

	const createCategory = vscode.commands.registerCommand(COMMAND_NAME.createCategory, () => {
		Settings.create(TaxonomyType.Category);
	});

	const exportTaxonomy = vscode.commands.registerCommand(COMMAND_NAME.exportTaxonomy, Settings.export);

	const remap = vscode.commands.registerCommand(COMMAND_NAME.remap, Settings.remap);

	const setLastModifiedDate = vscode.commands.registerCommand(COMMAND_NAME.setLastModifiedDate, Article.setLastModifiedDate);

	const generateSlug = vscode.commands.registerCommand(COMMAND_NAME.generateSlug, Article.generateSlug);

	const createFromTemplate = vscode.commands.registerCommand(COMMAND_NAME.createFromTemplate, (folder: vscode.Uri) => {
		const folderPath = Folders.getFolderPath(folder);
    if (folderPath) {
      Template.create(folderPath);
    }
	}); 

	let createTemplate = vscode.commands.registerCommand(COMMAND_NAME.createTemplate, Template.generate);

	const toggleDraftCommand = COMMAND_NAME.toggleDraft;
	const toggleDraft = vscode.commands.registerCommand(toggleDraftCommand, async () => {
		await Article.toggleDraft();
		triggerShowDraftStatus(`toggleDraft`);
	});

	// Register project folders
	const registerFolder = vscode.commands.registerCommand(COMMAND_NAME.registerFolder, Folders.register);

	const unregisterFolder = vscode.commands.registerCommand(COMMAND_NAME.unregisterFolder, Folders.unregister);

	const createFolder = vscode.commands.registerCommand(COMMAND_NAME.createFolder, Folders.addMediaFolder);

	const createByContentType = vscode.commands.registerCommand(COMMAND_NAME.createByContentType, ContentType.createContent);
	const createByTemplate = vscode.commands.registerCommand(COMMAND_NAME.createByTemplate, Folders.create);
	const createContent = vscode.commands.registerCommand(COMMAND_NAME.createContent, Content.create);

	// Initialize command
	Template.init();
	const projectInit = vscode.commands.registerCommand(COMMAND_NAME.init, async (cb: Function) => {
		await Project.init();

		if (cb) {
			cb();
		}
	});

	// Settings promotion command
	subscriptions.push(vscode.commands.registerCommand(COMMAND_NAME.promote, SettingsHelper.promote));

	// Collapse all sections in the webview
	const collapseAll = vscode.commands.registerCommand(COMMAND_NAME.collapseSections, () => {
		ExplorerView.getInstance()?.collapseAll();
	});

	// Things to do when configuration changes
	SettingsHelper.onConfigChange((global?: any) => {
		Template.init();
		Preview.init();

		SettingsListener.getSettings();
		DataListener.getFoldersAndFiles();	
		MarkdownFoldingProvider.triggerHighlighting();
		ModeSwitch.register();
	});

	// Create the status bar
 	frontMatterStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	frontMatterStatusBar.command = toggleDraftCommand;
	subscriptions.push(frontMatterStatusBar);
	statusDebouncer = debounceCallback();
	
	// Register listeners that make sure the status bar updates
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => triggerShowDraftStatus(`onDidChangeActiveTextEditor`)));
	subscriptions.push(vscode.window.onDidChangeTextEditorSelection((e) => {
		if (e.kind === vscode.TextEditorSelectionChangeKind.Mouse) {
			triggerShowDraftStatus(`onDidChangeTextEditorSelection`);
		}
	}));
	
	// Automatically run the command
	triggerShowDraftStatus(`triggerShowDraftStatus`);

	// Listener for file edit changes
	subscriptions.push(vscode.workspace.onWillSaveTextDocument(handleAutoDateUpdate));

	// Listener for file saves
	subscriptions.push(PagesListener.saveFileWatcher());

	// Webview for preview
	Preview.init();
	subscriptions.push(vscode.commands.registerCommand(COMMAND_NAME.preview, () => Preview.open(extensionPath) ));

	// Inserting an image in Markdown
	subscriptions.push(vscode.commands.registerCommand(COMMAND_NAME.insertImage, Article.insertImage));

	// Inserting a snippet in Markdown
	subscriptions.push(vscode.commands.registerCommand(COMMAND_NAME.insertSnippet, Article.insertSnippet));

	// Create the editor experience for bulk scripts
	subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(ContentProvider.scheme, new ContentProvider()));

	// What you see, is what you get
	Wysiwyg.registerCommands(subscriptions);
	
	// Mode switching
	ModeSwitch.register();

	// Diagnostics
	subscriptions.push(vscode.commands.registerCommand(COMMAND_NAME.diagnostics, Diagnostics.show));

	// Subscribe all commands
	subscriptions.push(
		insertTags,
		explorerView,
		insertCategories,
		createTag,
		createCategory,
		exportTaxonomy,
		remap,
		setLastModifiedDate,
		generateSlug,
		createFromTemplate,
		createTemplate,
		toggleDraft,
		registerFolder,
		unregisterFolder,
		createContent,
		createByContentType,
		createByTemplate,
		projectInit,
		collapseAll,
		createFolder
	);
}

export function deactivate() {
	Telemetry.dispose();
}

const handleAutoDateUpdate = (e: vscode.TextDocumentWillSaveEvent) => {
	Article.autoUpdate(e);
};

const triggerShowDraftStatus = (location: string) => {
	Logger.info(`Triggering draft status update: ${location}`);
	statusDebouncer(() => { StatusListener.verify(frontMatterStatusBar, collection); }, 1000);
};

const debounceCallback = () => {
  let timeout: NodeJS.Timeout;

  return (fnc: any, time: number) => {
    const functionCall = (...args: any[]) => fnc.apply(args);
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time) as any;
  };
};