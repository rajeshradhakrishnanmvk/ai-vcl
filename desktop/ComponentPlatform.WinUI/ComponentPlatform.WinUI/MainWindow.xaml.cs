using System;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using ComponentPlatform.DesktopBridge;
using Microsoft.Web.WebView2.Core;

namespace ComponentPlatform.WinUI;

public partial class MainWindow : Window
{
    private const string DevUrl = "http://localhost:4200";
    private const string ProductionIndexPath = "wwwroot/index.html";

    private readonly WebViewBridgeHandler _bridgeHandler = new();

    public MainWindow()
    {
        InitializeComponent();
        Loaded += OnLoaded;
    }

    private async void OnLoaded(object sender, RoutedEventArgs e)
    {
        await InitializeWebViewAsync();
    }

    private async Task InitializeWebViewAsync()
    {
        await WebView.EnsureCoreWebView2Async();

        var wv = WebView.CoreWebView2;

        // Security: disable dev tools, restrict navigation in production
        wv.Settings.AreDevToolsEnabled =
#if DEBUG
            true;
#else
            false;
#endif

        wv.Settings.IsWebMessageEnabled = true;
        wv.Settings.AreHostObjectsAllowed = false;
        wv.Settings.AreDefaultContextMenusEnabled = false;

        // Restrict navigation to approved origins only
        wv.NavigationStarting += OnNavigationStarting;

        // Receive messages from Angular
        wv.WebMessageReceived += OnWebMessageReceived;

#if DEBUG
        wv.Navigate(DevUrl);
#else
        wv.Navigate(new Uri(System.IO.Path.GetFullPath(ProductionIndexPath)).AbsoluteUri);
#endif
    }

    private static void OnNavigationStarting(object? sender, CoreWebView2NavigationStartingEventArgs e)
    {
        var uri = new Uri(e.Uri);
        bool isAllowed = uri.Host is "localhost" || uri.Scheme is "file" or "data";
        if (!isAllowed)
        {
            e.Cancel = true;
        }
    }

    private void OnWebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        var json = e.TryGetWebMessageAsString();
        var result = _bridgeHandler.HandleMessage(json);

        if (!result.IsSuccess)
        {
            var errorJson = JsonSerializer.Serialize(new
            {
                id = result.CorrelationId,
                type = "error",
                version = "1.0",
                payload = new { message = result.ErrorMessage }
            });
            WebView.CoreWebView2.PostWebMessageAsString(errorJson);
        }
        else
        {
            DispatchNativeCommand(result);
        }
    }

    private void DispatchNativeCommand(BridgeResult result)
    {
        // Route allowed message types to native Windows APIs
        switch (result.MessageType?.ToLowerInvariant())
        {
            case "window.minimize":
                Dispatcher.Invoke(() => WindowState = WindowState.Minimized);
                break;
            case "window.maximize":
                Dispatcher.Invoke(() => WindowState =
                    WindowState == WindowState.Maximized ? WindowState.Normal : WindowState.Maximized);
                break;
            case "window.close":
                Dispatcher.Invoke(Close);
                break;
            case "notification.show":
                // Extend with Windows.UI.Notifications for toast notifications
                break;
        }
    }
}
