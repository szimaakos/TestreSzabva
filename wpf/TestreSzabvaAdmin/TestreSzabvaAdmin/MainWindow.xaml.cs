using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Windows;
using TestreSzabvaAdmin.Models;

namespace TestreSzabvaAdmin
{
    public partial class MainWindow : Window
    {
        private ObservableCollection<Food> _foods = new ObservableCollection<Food>();
        private ObservableCollection<Category> _categories = new ObservableCollection<Category>();
        private readonly HttpClient _httpClient = new HttpClient();

        public MainWindow()
        {
            InitializeComponent();
            FoodsDataGrid.ItemsSource = _foods;
            CategoriesListBox.ItemsSource = _categories;

            // Állítsd be az API alap URL-jét (pl. a 5162-es port)
            _httpClient.BaseAddress = new Uri("http://localhost:5162/");

            // Ételek és kategóriák betöltése
            _ = LoadFoods();
            _ = LoadCategories();
        }

        private async Task LoadFoods()
        {
            try
            {
                var foods = await _httpClient.GetFromJsonAsync<Food[]>("api/Etel");
                _foods.Clear();
                if (foods != null)
                {
                    foreach (var food in foods)
                    {
                        _foods.Add(food);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba az ételek betöltésekor: " + ex.Message);
            }
        }

        private async Task LoadCategories()
        {
            try
            {
                var categories = await _httpClient.GetFromJsonAsync<Category[]>("api/Kategoria");
                _categories.Clear();
                if (categories != null)
                {
                    foreach (var cat in categories)
                    {
                        _categories.Add(cat);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba a kategóriák betöltésekor: " + ex.Message);
            }
        }

        private async void AddFood_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Kiválasztott kategóriák azonosítóinak lekérése
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

                var response = await _httpClient.PostAsJsonAsync("api/Etel", createFoodDto);
                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Étel sikeresen hozzáadva.");
                    await LoadFoods();
                    ClearForm();
                }
                else
                {
                    MessageBox.Show("Hiba történt az étel hozzáadásakor.");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba: " + ex.Message);
            }
        }

        private void ClearForm()
        {
            NameTextBox.Clear();
            CaloriesTextBox.Clear();
            ProteinTextBox.Clear();
            CarbsTextBox.Clear();
            FatsTextBox.Clear();
            CategoriesListBox.UnselectAll();
        }
    }
}