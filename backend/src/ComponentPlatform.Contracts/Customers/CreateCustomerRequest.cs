namespace ComponentPlatform.Contracts.Customers;

public sealed record CreateCustomerRequest(
    string Name,
    string Email,
    string? Phone);
