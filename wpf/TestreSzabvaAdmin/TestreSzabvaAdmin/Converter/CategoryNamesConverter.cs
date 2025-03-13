using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Windows.Data;
using TestreSzabvaAdmin.Models;

namespace TestreSzabvaAdmin.Converters
{
    public class CategoryNamesConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var list = value as IEnumerable<EtelKategoria>;
            if (list == null || !list.Any())
                return "N/A";
            return string.Join(", ", list.Select(x => x.Kategoria.Name));
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}