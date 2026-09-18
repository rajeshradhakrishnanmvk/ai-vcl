namespace ComponentPlatform.Domain.Common;

public interface IDomainEvent
{
    DateTimeOffset OccurredOn { get; }
}
