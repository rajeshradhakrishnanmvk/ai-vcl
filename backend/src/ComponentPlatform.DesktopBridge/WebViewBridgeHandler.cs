using ComponentPlatform.Contracts.Bridge;
using System.Text.Json;

namespace ComponentPlatform.DesktopBridge;

public sealed class WebViewBridgeHandler
{
    private static readonly HashSet<string> AllowedMessageTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "file.open", "file.save", "notification.show", "window.minimize",
        "window.maximize", "window.close", "clipboard.read", "clipboard.write"
    };

    private static readonly JsonSerializerOptions JsonOptions =
        new() { PropertyNameCaseInsensitive = true };

    public BridgeResult HandleMessage(string json)
    {
        NativeMessage<JsonElement>? message;
        try
        {
            message = JsonSerializer.Deserialize<NativeMessage<JsonElement>>(json, JsonOptions);
        }
        catch (JsonException ex)
        {
            return BridgeResult.Failure($"Invalid JSON: {ex.Message}");
        }

        if (message is null)
            return BridgeResult.Failure("Null message received.");

        if (!AllowedMessageTypes.Contains(message.Type))
            return BridgeResult.Failure($"Message type '{message.Type}' is not allowed.");

        return BridgeResult.Success(message.Type, message.Id);
    }
}

public sealed record BridgeResult(bool IsSuccess, string? ErrorMessage, string? MessageType, string? CorrelationId)
{
    public static BridgeResult Success(string messageType, string correlationId)
        => new(true, null, messageType, correlationId);

    public static BridgeResult Failure(string error)
        => new(false, error, null, null);
}
