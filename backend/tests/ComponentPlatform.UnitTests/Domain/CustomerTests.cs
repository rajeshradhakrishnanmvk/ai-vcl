using ComponentPlatform.Domain.Customers;
using FluentAssertions;

namespace ComponentPlatform.UnitTests.Domain;

public sealed class CustomerTests
{
    [Fact]
    public void Create_WithValidData_ShouldCreateCustomer()
    {
        var customer = Customer.Create("John Doe", "john@example.com", "+1234567890");

        customer.Name.Should().Be("John Doe");
        customer.Email.Should().Be("john@example.com");
        customer.Phone.Should().Be("+1234567890");
        customer.Id.Should().NotBeEmpty();
        customer.CreatedAt.Should().BeCloseTo(DateTimeOffset.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void Create_WithEmailUpperCase_ShouldNormalizeLowerCase()
    {
        var customer = Customer.Create("Jane", "JANE@EXAMPLE.COM");
        customer.Email.Should().Be("jane@example.com");
    }

    [Fact]
    public void Create_WithEmptyName_ShouldThrow()
    {
        var act = () => Customer.Create("", "test@test.com");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Update_WithValidData_ShouldUpdateCustomer()
    {
        var customer = Customer.Create("Old Name", "old@example.com");
        customer.Update("New Name", "new@example.com", "555-1234");

        customer.Name.Should().Be("New Name");
        customer.Email.Should().Be("new@example.com");
        customer.Phone.Should().Be("555-1234");
        customer.UpdatedAt.Should().NotBeNull();
    }
}
