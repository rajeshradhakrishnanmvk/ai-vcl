using ComponentPlatform.Application.Customers;
using ComponentPlatform.Contracts.Customers;
using ComponentPlatform.Domain.Customers;
using FluentAssertions;
using NSubstitute;

namespace ComponentPlatform.UnitTests.Application;

public sealed class CustomerServiceTests
{
    private readonly ICustomerRepository _repository = Substitute.For<ICustomerRepository>();
    private readonly CustomerService _sut;

    public CustomerServiceTests()
    {
        _sut = new CustomerService(_repository);
    }

    [Fact]
    public async Task CreateAsync_WithValidRequest_ShouldReturnDto()
    {
        var request = new CreateCustomerRequest("Alice", "alice@example.com", null);
        _repository.SaveChangesAsync(Arg.Any<CancellationToken>()).Returns(1);

        var result = await _sut.CreateAsync(request);

        result.Name.Should().Be("Alice");
        result.Email.Should().Be("alice@example.com");
        await _repository.Received(1).AddAsync(Arg.Any<Customer>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ShouldReturnNull()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns((Customer?)null);

        var result = await _sut.GetByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task DeleteAsync_WhenNotFound_ShouldThrow()
    {
        _repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns((Customer?)null);

        var act = async () => await _sut.DeleteAsync(Guid.NewGuid());

        await act.Should().ThrowAsync<KeyNotFoundException>();
    }
}
