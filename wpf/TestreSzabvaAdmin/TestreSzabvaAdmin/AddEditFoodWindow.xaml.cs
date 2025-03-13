using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Windows;
using TestreSzabvaAdmin.Models;

namespace TestreSzabvaAdmin
{
    public partial class AddEditFoodWindow : Window
    {
        private readonly HttpClient _httpClient = new HttpClient();
        private readonly bool _isEditMode;
        public Food FoodItem { get; set; }
        private ObservableCollection<Category> _categories;

        // Konstruktor új étel hozzáadásához.
        public AddEditFoodWindow(ObservableCollection<Category> categories)
        {
            InitializeComponent();
            _httpClient.BaseAddress = new Uri("http://localhost:5162/");
            _categories = categories;
            CategoriesListBox.ItemsSource = _categories;
            _isEditMode = false;
            WindowTitleTextBlock.Text = "Új étel hozzáadása";
        }

        // Konstruktor étel szerkesztéséhez.
        public AddEditFoodWindow(ObservableCollection<Category> categories, Food food) : this(categories)
        {
            _isEditMode = true;
            FoodItem = food;
            WindowTitleTextBlock.Text = "Étel szerkesztése";
            NameTextBox.Text = food.Name;
            CaloriesTextBox.Text = food.Calories.ToString();
            ProteinTextBox.Text = food.Protein?.ToString() ?? "";
            CarbsTextBox.Text = food.Carbs?.ToString() ?? "";
            FatsTextBox.Text = food.Fats?.ToString() ?? "";
            if (food.EtelKategoriak != null)
            {
                foreach (var ek in food.EtelKategoriak)
                {
                    var cat = _categories.FirstOrDefault(c => c.CategoryId == ek.Kategoria.CategoryId);
                    if (cat != null && !CategoriesListBox.SelectedItems.Contains(cat))
                        CategoriesListBox.SelectedItems.Add(cat);
                }
            }
        }

        private async void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var selectedCategoryIds = CategoriesListBox.SelectedItems
                                        .Cast<Category>()
                                        .Select(c => c.CategoryId)
                                        .ToList();
                var createFoodDto = new CreateFoodDto
                {
                    Name = NameTextBox.Text,
                    Calories = float.Parse(CaloriesTextBox.Text),
                    Protein = string.IsNullOrWhiteSpace(ProteinTextBox.Text) ? (float?)null : float.Parse(ProteinTextBox.Text),
                    Carbs = string.IsNullOrWhiteSpace(CarbsTextBox.Text) ? (float?)null : float.Parse(CarbsTextBox.Text),
                    Fats = string.IsNullOrWhiteSpace(FatsTextBox.Text) ? (float?)null : float.Parse(FatsTextBox.Text),
                    CategoryIds = selectedCategoryIds
                };

                if (_isEditMode && FoodItem != null)
                {
                    var response = await _httpClient.PutAsJsonAsync($"api/Etel/{FoodItem.FoodId}", createFoodDto);
                    if (response.IsSuccessStatusCode)
                    {
                        MessageBox.Show("Étel frissítve.");
                        DialogResult = true;
                    }
                    else
                    {
                        MessageBox.Show("Hiba történt a frissítéskor.");
                    }
                }
                else
                {
                    var response = await _httpClient.PostAsJsonAsync("api/Etel", createFoodDto);
                    if (response.IsSuccessStatusCode)
                    {
                        MessageBox.Show("Étel hozzáadva.");
                        DialogResult = true;
                    }
                    else
                    {
                        MessageBox.Show("Hiba történt az étel hozzáadásakor.");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba: " + ex.Message);
            }
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
        }
    }
}
