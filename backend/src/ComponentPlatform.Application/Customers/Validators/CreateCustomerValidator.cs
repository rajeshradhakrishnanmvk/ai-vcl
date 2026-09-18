using ComponentPlatform.Contracts.Customers;
using FluentValidation;

namespace ComponentPlatform.Application.Customers.Validators;

public sealed class CreateCustomerValidator : AbstractValidator<CreateCustomerRequest>
{
    public CreateCustomerValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(320);
        RuleFor(x => x.Phone).MaximumLength(50).When(x => x.Phone is not null);
    }
}
