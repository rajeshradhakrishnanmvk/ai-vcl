using ComponentPlatform.DesktopBridge;
using FluentAssertions;

namespace ComponentPlatform.UnitTests.Bridge;

public sealed class WebViewBridgeHandlerTests
{
    private readonly WebViewBridgeHandler _sut = new();

    [Fact]
    public void HandleMessage_AllowedType_ShouldSucceed()
    {
        var json = """{"Id":"123","Type":"file.open","Version":"1.0","Payload":{}}""";
        var result = _sut.HandleMessage(json);

        result.IsSuccess.Should().BeTrue();
        result.MessageType.Should().Be("file.open");
    }

    [Fact]
    public void HandleMessage_DisallowedType_ShouldFail()
    {
        var json = """{"Id":"abc","Type":"exec.shell","Version":"1.0","Payload":{}}""";
        var result = _sut.HandleMessage(json);

        result.IsSuccess.Should().BeFalse();
        result.ErrorMessage.Should().Contain("not allowed");
    }

    [Fact]
    public void HandleMessage_InvalidJson_ShouldFail()
    {
        var result = _sut.HandleMessage("not json");
        result.IsSuccess.Should().BeFalse();
    }
}
