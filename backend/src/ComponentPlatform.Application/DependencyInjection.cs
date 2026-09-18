using ComponentPlatform.Application.Customers;
using ComponentPlatform.Application.Customers.Validators;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace ComponentPlatform.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IValidator<ComponentPlatform.Contracts.Customers.CreateCustomerRequest>, CreateCustomerValidator>();
        return services;
    }
}
