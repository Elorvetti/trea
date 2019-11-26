using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.AspNetCore.Identity;

namespace admin.Data
{
    public class TreAContext: IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public TreAContext(DbContextOptions<TreAContext> o ) : base(o) {}
        public virtual DbSet<Administrator> administrator { get; set; }
        public virtual DbSet<Category> category { get; set; }
        public virtual DbSet<Argument> argument { get; set; }
        public virtual DbSet<Post> post { get; set; }
        public virtual DbSet<Photo> photo { get; set; }
        public virtual DbSet<Video> video { get; set; }
        public virtual DbSet<Album> album { get; set; }
        public virtual DbSet<Podcast> podcast { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder){
            optionsBuilder
                .ConfigureWarnings(warnings => 
                    warnings.Throw(RelationalEventId.QueryClientEvaluationWarning));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Administrator>(entity => {
                entity.HasKey(e => e.id);
                entity.Property(e => e.user);
                entity.Property(e => e.password); 
                entity.Property(e => e.IsActive);
                entity.Property(e => e.rememberMe);
                entity.Property(e => e.photoId);
            });

            modelBuilder.Entity<Category>(entity => {
                entity.HasKey(c => c.id);
                entity.Property(c => c.name);
                entity.Property(c => c.displayOrder);
            });

            modelBuilder.Entity<Argument>(entity => { 
                entity.HasKey(a => a.id);
                entity.Property(a => a.name);
                entity.HasOne(a => a.category).WithMany(a => a.arguments);
            });

            modelBuilder.Entity<Post>(entity => { 
                entity.HasKey(p => p.id);
                entity.Property(p => p.title);
                entity.Property(p => p.testo);
                entity.Property(p => p.pubblico);
                entity.Property(p => p.isArgument);
                entity.HasOne(p => p.argument).WithMany(p => p.posts);
            });

            modelBuilder.Entity<Photo>(entity => {
                entity.HasKey(p => p.id);
                entity.Property(p => p.name);
                entity.Property(p => p.path);
            });

            modelBuilder.Entity<Video>(entity => {
                entity.HasKey(v => v.id);
                entity.Property(v => v.name);
                entity.Property(v => v.path);
            });

            modelBuilder.Entity<Album>(entity => {
                entity.HasKey(a => a.id);
                entity.Property(a => a.idImmagini);
                entity.Property(a => a.idVideo);
            });

            modelBuilder.Entity<Podcast>(entity => {
                entity.HasKey(p => p.id);
                entity.Property(p => p.name);
                entity.Property(p => p.path);
            });

        }

    }
}