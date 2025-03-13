using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
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
            _httpClient.BaseAddress = new Uri("http://localhost:5162/");
            _ = LoadFoods();
            _ = LoadCategories();
            CollectionViewSource.GetDefaultView(_foods).Filter = FilterFoods;
        }

        private bool FilterFoods(object obj)
        {
            if (!(obj is Food food))
                return false;
            string searchText = SearchTextBox.Text.Trim().ToLower();
            string selectedCategory = "Összes";
            if (CategoryFilterComboBox.SelectedItem is ComboBoxItem cbi && cbi.Content != null)
                selectedCategory = cbi.Content.ToString();

            bool matchesSearch = string.IsNullOrEmpty(searchText) || food.Name.ToLower().Contains(searchText);
            bool matchesCategory = selectedCategory == "Összes" ||
                (food.EtelKategoriak != null && food.EtelKategoriak.Any(ek =>
                    ek.Kategoria.Name.Equals(selectedCategory, StringComparison.OrdinalIgnoreCase)));
            return matchesSearch && matchesCategory;
        }

        private async System.Threading.Tasks.Task LoadFoods()
        {
            try
            {
                var foods = await _httpClient.GetFromJsonAsync<Food[]>("api/Etel");
                _foods.Clear();
                if (foods != null)
                {
                    foreach (var food in foods)
                        _foods.Add(food);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba az ételek betöltésekor: " + ex.Message);
            }
        }

        private async System.Threading.Tasks.Task LoadCategories()
        {
            try
            {
                var categories = await _httpClient.GetFromJsonAsync<Category[]>("api/Kategoria");
                _categories.Clear();
                if (categories != null)
                {
                    foreach (var cat in categories)
                        _categories.Add(cat);
                }
                CategoryFilterComboBox.Items.Clear();
                CategoryFilterComboBox.Items.Add(new ComboBoxItem { Content = "Összes", IsSelected = true });
                foreach (var cat in _categories)
                    CategoryFilterComboBox.Items.Add(new ComboBoxItem { Content = cat.Name });
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba a kategóriák betöltésekor: " + ex.Message);
            }
        }

        private void SearchTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            CollectionViewSource.GetDefaultView(_foods).Refresh();
        }

        private void CategoryFilterComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            CollectionViewSource.GetDefaultView(_foods).Refresh();
        }

        private void NewFoodButton_Click(object sender, RoutedEventArgs e)
        {
            var addWindow = new AddEditFoodWindow(_categories);
            addWindow.Owner = this;
            if (addWindow.ShowDialog() == true)
                _ = LoadFoods();
        }

        private void EditFoodButton_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn && btn.Tag is Food food)
            {
                var editWindow = new AddEditFoodWindow(_categories, food);
                editWindow.Owner = this;
                if (editWindow.ShowDialog() == true)
                    _ = LoadFoods();
            }
        }

        private async void DeleteFoodButton_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button btn && btn.Tag is Food food)
            {
                if (MessageBox.Show($"Biztosan törlöd a(z) {food.Name} ételt?", "Törlés megerősítése", MessageBoxButton.YesNo, MessageBoxImage.Question) == MessageBoxResult.Yes)
                {
                    try
                    {
                        var response = await _httpClient.DeleteAsync($"api/Etel/{food.FoodId}");
                        if (response.IsSuccessStatusCode)
                        {
                            MessageBox.Show("Étel törölve.");
                            await LoadFoods();
                        }
                        else
                        {
                            MessageBox.Show("Hiba történt a törlés során.");
                        }
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Hiba: " + ex.Message);
                    }
                }
            }
        }
    }
}