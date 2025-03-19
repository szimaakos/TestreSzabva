using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Windows;
using TestreSzabvaAdmin.Models;

namespace TestreSzabvaAdmin
{
    public partial class ImportCsvWindow : Window
    {
        private string selectedFilePath;
        private readonly HttpClient _httpClient = new HttpClient();

        public ImportCsvWindow()
        {
            InitializeComponent();
            _httpClient.BaseAddress = new Uri("http://localhost:5162/");
        }

        private void SelectCsvButton_Click(object sender, RoutedEventArgs e)
        {
            var openFileDialog = new Microsoft.Win32.OpenFileDialog
            {
                Filter = "CSV fájlok (*.csv)|*.csv"
            };

            if (openFileDialog.ShowDialog() == true)
            {
                selectedFilePath = openFileDialog.FileName;
                StatusTextBlock.Text = $"Fájl kiválasztva: {Path.GetFileName(selectedFilePath)}";
                ImportButton.IsEnabled = true;
            }
        }

        private async void ImportButton_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(selectedFilePath))
                return;

            try
            {
                var lines = await File.ReadAllLinesAsync(selectedFilePath);
                if (lines.Length < 2)
                {
                    MessageBox.Show("A fájl üres vagy nincs adat.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }

                int successCount = 0;
                int errorCount = 0;

                // Az első sor fejléc
                for (int i = 1; i < lines.Length; i++)
                {
                    var line = lines[i];
                    if (string.IsNullOrWhiteSpace(line))
                        continue;

                    // Várjuk, hogy a CSV sor formátuma: Name,Calories,Protein,Carbs,Fats,CategoryIds
                    var columns = line.Split(',');
                    if (columns.Length < 2)
                    {
                        errorCount++;
                        continue;
                    }

                    try
                    {
                        var dto = new CreateFoodDto
                        {
                            Name = columns[0].Trim(),
                            Calories = float.Parse(columns[1].Trim(), CultureInfo.InvariantCulture),
                            Protein = columns.Length > 2 && !string.IsNullOrWhiteSpace(columns[2]) ? float.Parse(columns[2].Trim(), CultureInfo.InvariantCulture) : (float?)null,
                            Carbs = columns.Length > 3 && !string.IsNullOrWhiteSpace(columns[3]) ? float.Parse(columns[3].Trim(), CultureInfo.InvariantCulture) : (float?)null,
                            Fats = columns.Length > 4 && !string.IsNullOrWhiteSpace(columns[4]) ? float.Parse(columns[4].Trim(), CultureInfo.InvariantCulture) : (float?)null,
                            CategoryIds = new List<int>()
                        };

                        if (columns.Length > 5 && !string.IsNullOrWhiteSpace(columns[5]))
                        {
                            // A kategória azonosítókat pontosvesszővel választjuk el
                            var catIds = columns[5].Split(';');
                            foreach (var id in catIds)
                            {
                                if (int.TryParse(id.Trim(), out int catId))
                                {
                                    dto.CategoryIds.Add(catId);
                                }
                            }
                        }

                        // POST kérés az étel létrehozásához
                        var response = await _httpClient.PostAsJsonAsync("api/Etel", dto);
                        if (response.IsSuccessStatusCode)
                        {
                            successCount++;
                        }
                        else
                        {
                            errorCount++;
                        }
                    }
                    catch (Exception)
                    {
                        errorCount++;
                    }
                }

                MessageBox.Show($"Importálás kész.\nSikeres: {successCount}\nHibás: {errorCount}", "Importálás eredménye", MessageBoxButton.OK, MessageBoxImage.Information);
                this.DialogResult = true;
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba az importálás során: " + ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
