namespace TestreSzabvaAdmin.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string Name { get; set; }

    }
    public class EtelKategoria
    {
        public Category Kategoria { get; set; }
    }
}