namespace ComponentPlatform.Contracts.Pagination;

public sealed record PagedRequest(
    int Page = 1,
    int PageSize = 20,
    string? Sort = null,
    string? Filter = null);
