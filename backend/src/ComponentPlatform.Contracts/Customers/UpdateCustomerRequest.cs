namespace ComponentPlatform.Contracts.Customers;

public sealed record UpdateCustomerRequest(
    string Name,
    string Email,
    string? Phone);
