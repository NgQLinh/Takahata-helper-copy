using System.Net;
using FluentValidation;

namespace TAKAHATA.Application.Settings.Commands
{
    public class UpdateSettingsCommandValidator
        : AbstractValidator<UpdateSettingsCommand>
    {
        public UpdateSettingsCommandValidator()
        {
            RuleFor(x => x.IpAddress)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("Địa chỉ IP không được để trống.")
                .MaximumLength(45)
                .WithMessage("Địa chỉ IP không được vượt quá 45 ký tự.")
                .Must(BeAValidIpAddress)
                .WithMessage("Địa chỉ IP không đúng định dạng.");

            RuleFor(x => x.Port)
                .InclusiveBetween(1, 65535)
                .WithMessage("Cổng kết nối phải nằm trong khoảng từ 1 đến 65535.");
        }

        private static bool BeAValidIpAddress(string? ipAddress)
        {
            return !string.IsNullOrWhiteSpace(ipAddress)
                && IPAddress.TryParse(ipAddress.Trim(), out _);
        }
    }
}