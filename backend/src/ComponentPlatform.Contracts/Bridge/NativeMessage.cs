namespace ComponentPlatform.Contracts.Bridge;

public sealed record NativeMessage<T>(
    string Id,
    string Type,
    string Version,
    T Payload);
